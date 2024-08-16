import mongoose, { Document } from "mongoose";
import { ITenantUserService } from "../interfaces/ITenantUserService";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { ITenantService } from "../interfaces/ITenantService";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import { CustomError, UnauthorizedError } from "teamsync-common";
import { inject } from "inversify";




export default class TenantUserService implements ITenantUserService {
    private tenantUserRepository: ITenantUserRepository;
    private tenantService?: ITenantService;

    constructor(
        @inject("ITenantUserRepository") tenantUserRepository: ITenantUserRepository,
        @inject("ITenantService") tenantService: ITenantService

    ) {
        this.tenantUserRepository = tenantUserRepository;
        this.tenantService = tenantService;
    }

    async getAvailableTenantUsers(user: IDecodedUser, role: string | undefined): Promise<(ITenantUsers & Document)[]> {
        if (!user.decode?.tenantId) {
            throw new CustomError("Tenant Id not found", 400)
        }

        const tenant = await this.tenantService?.getTenantById(user.decode.tenantId);
        if (!tenant) {
            throw new CustomError("Tenant not found", 404);
        }

        if (user.decode.role !== 'Tenant_Admin' && user.decode.role !== 'Manager') {
            throw new UnauthorizedError()
        }

        if (user.decode.role === 'Manager' && (role === 'Manager' || !role)) {
            throw new UnauthorizedError()
        }

        return await this.tenantUserRepository.fetchAvailableTenantUsers(
            user.decode.tenantId,
            new mongoose.Types.ObjectId(user.decode.branchId),
            role!
        );
    }

    async createTenantUser(data: ITenantUsers, dbName: string): Promise<void> {
        await this.tenantUserRepository.create(data, dbName);
    }

    async updateTenantUser(data: ITenantUsers, dbName: string, id: mongoose.Types.ObjectId): Promise<void> {
        await this.tenantUserRepository.update(data, dbName, id);
    }

    async handleKafkaEvent(eventType: string, data: any, dbName: string): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.createTenantUser(data, dbName);
                break;
            case 'update':
                await this.updateTenantUser(data, dbName, data._id);
                break;
            default:
                throw new Error(`Unhandled event type: ${eventType}`);
        }
    }
}
