import mongoose, { Document } from "mongoose";
import { ITenantUserService } from "../interfaces/ITenantUserService";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { ITenantService } from "../interfaces/ITenantService";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITenantUsers } from "../../entities/TenantUserEntity";


export default class TenantUserService implements ITenantUserService {
    private tenantUserRepository: ITenantUserRepository;
    private tenantService: ITenantService;

    constructor(
        tenantUserRepository: ITenantUserRepository,
        tenantService: ITenantService
    ) {
        this.tenantUserRepository = tenantUserRepository;
        this.tenantService = tenantService;
    }

    async getAvailableTenantUsers(user: IDecodedUser, role: string | undefined): Promise<(ITenantUsers & Document)[]> {
        if (!user.decode?.tenantId) {
            throw new Error("Tenant ID not found");
        }

        const tenant = await this.tenantService.getTenantById(user.decode.tenantId);
        if (!tenant) {
            throw new Error("Tenant not found");
        }

        if (user.decode.role !== 'Tenant_Admin' && user.decode.role !== 'Manager') {
            throw new Error("Unauthorized");
        }

        if (user.decode.role === 'Manager' && (role === 'Manager' || !role)) {
            throw new Error("Unauthorized");
        }

        return await this.tenantUserRepository.fetchAvailableTenantUsers(
            user.decode.tenantId,
            new mongoose.Types.ObjectId(user.decode.branchId),
            role!
        );
    }
}
