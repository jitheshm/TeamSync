import { Document } from "mongoose";
import { ITenantService } from "../interfaces/ITenantService";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;

    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository
    ) {
        this.tenantRepository = tenantRepository;
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

}
