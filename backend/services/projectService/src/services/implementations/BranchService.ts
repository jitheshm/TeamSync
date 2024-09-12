// src/services/implementations/BranchService.ts

import { IBranchService } from "../interfaces/IBranchService";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IBranches } from "../../entities/BranchEntity";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";

@injectable()
export class BranchService implements IBranchService {
    private branchRepository: IBranchRepository;

    constructor(
        @inject("IBranchRepository") branchRepository: IBranchRepository
    ) {
        this.branchRepository = branchRepository;
    }

    async createBranch(data: IBranches, dbName: string): Promise<void> {
        await this.branchRepository.create(data, dbName);
    }

    async updateBranch(data: IBranches, dbName: string, id: mongoose.Types.ObjectId): Promise<void> {
        await this.branchRepository.update(data, dbName, id);
    }

    async handleKafkaEvent(eventType: string, data: any, dbName: string): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.createBranch(data, dbName);
                break;
            case 'update':
                await this.updateBranch(data, dbName, data._id);
                break;
            default:
                throw new Error(`Unhandled event type: ${eventType}`);
        }
    }
}
