import { Document } from "mongoose";
import { ITenantUserService } from "../interfaces/ITenantUserService";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";


export default class TenantUserService implements ITenantUserService {
    private tenantUserRepository: ITenantUserRepository;

    constructor(tenantUserRepository: ITenantUserRepository) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async handleEvent(eventType: string, data: any, dbName: string): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                     await this.tenantUserRepository.create(data, dbName);
                case "update":
                     await this.tenantUserRepository.update(data, dbName, data._id);
                
                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle tenant user event");
        }
    }

   
}
