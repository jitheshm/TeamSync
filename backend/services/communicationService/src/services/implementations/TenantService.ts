import mongoose, { Document } from "mongoose";
import { ITenantService } from "../interfaces/ITenantService";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { inject, injectable } from "inversify";
import { CustomError, NotFound } from "teamsync-common";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";

@injectable()
export default class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;
    private branchRepository: IBranchRepository

    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository,
        @inject("IBranchRepository") branchRepository: IBranchRepository
    ) {
        this.tenantRepository = tenantRepository;
        this.branchRepository = branchRepository
    }

    async handleEvent(eventType: string, data: any): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                    await this.tenantRepository.create(data);
                    break;
                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle tenant event");
        }
    }

    async tenantAuth(decode:any, body:any, params:any) {
        if (!decode?.tenantId) {
            throw new CustomError("Branch ID not found", 400)
        }
        const tenant = await this.tenantRepository.getTenantById(decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            throw new NotFound("Tenant not found");
        }

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
