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

    

}
