import { inject, injectable } from "inversify";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError, NotFound, UnauthorizedError } from "teamsync-common";
import { IMiddlewareService } from "../interfaces/IMiddlewareService";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import mongoose from "mongoose";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";

@injectable()
export class MiddlewareServices implements IMiddlewareService {
    private userRepository: IUserRepository;
    private tenantUserRepository: ITenantUserRepository;
    private branchRepository: IBranchRepository
    private tenantRepository: ITenantRepository
    private subscriptionRepository: ISubscriptionRepository;

    constructor(
        @inject("IUserRepository") userRepository: IUserRepository,
        @inject("ITenantUserRepository") tenantUserRepository: ITenantUserRepository,
        @inject("IBranchRepository") branchRepository: IBranchRepository,
        @inject("ITenantRepository") tenantRepository: ITenantRepository,
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository
    ) {
        this.userRepository = userRepository;
        this.tenantUserRepository = tenantUserRepository;
        this.branchRepository = branchRepository
        this.tenantRepository = tenantRepository
        this.subscriptionRepository = subscriptionRepository
    }


    async userApiAuth(token: string) {
        if (!process.env.JWT_SECRET_KEY)
            throw new Error('JWT_SECRET_KEY not found in .env file');

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

        console.log(decode);


        if (decode.role === 'Tenant_Admin') {
            const userObj = await this.userRepository.fetchUserByEmail(decode.email)
            if (!userObj || userObj.is_blocked || userObj.is_deleted || !userObj.is_verified) {
                throw new UnauthorizedError()
            }

            return { userObj, decode }
        } else if (decode) {
            const userObj = await this.tenantUserRepository.fetchTenantUserByEmail(decode.email, decode.tenantId)


            if (!userObj || userObj.is_deleted) {
                throw new UnauthorizedError()
            }

            return { userObj, decode }

        }
        else {
            throw new UnauthorizedError()
        }
    }

    async tenantAuth(decode: any, body: any, params: any) {
        if (!decode?.tenantId) {
            throw new CustomError("Branch ID not found", 400)
        }
        const tenant = await this.tenantRepository.getTenantById(decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            throw new NotFound("Tenant not found");
        }

        const subscriptionData = await this.subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(decode?.tenantId));

        if (!subscriptionData) throw  new UnauthorizedError();
        if (subscriptionData.status !== 'paid') throw new CustomError("Company account suspended", 403);

        if (!body.branch_id) {
            if (params.branchId) {
                body.branch_id = params.branchId
            }
        }

        if (body.branch_id || decode?.branchId) {
            let branchId = body.branch_id ? body.branch_id : decode?.branchId
            const branch = await this.branchRepository.fetchBranchById(decode?.tenantId, new mongoose.Types.ObjectId(branchId))
            if (branch) {
                return
            } else {
                throw new NotFound("Branch not found")
            }
        }
        else {
            throw new CustomError("Branch ID not found", 400)

        }
    }
}