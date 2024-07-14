import mongoose from "mongoose";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { ITenantService } from "../interfaces/ITenantService";


export default class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;

    constructor(tenantRepository: ITenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    async getTenantById(tenantId: mongoose.Types.ObjectId): Promise<ITenants | null> {
        return await this.tenantRepository.getTenantById(tenantId);
    }
}
