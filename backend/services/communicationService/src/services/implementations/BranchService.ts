import { Document } from "mongoose";
import { IBranchService } from "../interfaces/IBranchService";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { inject, injectable } from "inversify";
@injectable()
export default class BranchService implements IBranchService {
    private branchRepository: IBranchRepository;

    constructor(
        @inject("IBranchRepository") branchRepository: IBranchRepository
    ) {
        this.branchRepository = branchRepository;
    }

    async handleEvent(eventType: string, data: any, dbName: string): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                    await this.branchRepository.create(data, dbName);
                    break;
                case "update":
                    await this.branchRepository.update(data, dbName, data._id);
                    break;
                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle branch event");
        }
    }

    
}
