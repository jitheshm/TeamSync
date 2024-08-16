import { inject, injectable } from "inversify";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { ITenantService } from "../interfaces/ITenantService";

@injectable()
export class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;

    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository
    ) {
        this.tenantRepository = tenantRepository
    }

    async handleKafkaEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':

                await this.tenantRepository.create(data)
                break;

        }
    }
}