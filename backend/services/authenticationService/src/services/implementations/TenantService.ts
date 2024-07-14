import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import { ITenantService } from "../interfaces/ITenantService";


export default class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;

    constructor(tenantRepository: ITenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    async handleTenantEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.tenantRepository.create(data);
                break;
            // Add more cases for other event types as needed
            default:
                throw new Error(`Unknown event type: ${eventType}`);
        }
    }
}
