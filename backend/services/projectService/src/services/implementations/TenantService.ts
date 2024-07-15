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

    async createTenant(data: ITenants): Promise<void> {
        await this.tenantRepository.create(data);
    }

    async handleKafkaEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.createTenant(data);
                break;
            default:
                throw new Error(`Unhandled event type: ${eventType}`);
        }
    }
}
