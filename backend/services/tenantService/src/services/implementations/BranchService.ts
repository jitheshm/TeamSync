import { CustomError, IKafkaConnection, IProducer } from "teamsync-common";
import { IBranchService } from "../interfaces/IBranchService";
import mongoose from "mongoose";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IBranches } from "../../entities/BranchEntity";
import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { Producer } from "kafkajs";

@injectable()
export class BranchService implements IBranchService {

    private branchRepository: IBranchRepository
    private subscriptionRepository: ISubscriptionRepository
    private kafkaConnection: IKafkaConnection
    private createBranchProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<IBranches>>;


    constructor(
        @inject("IBranchRepository") branchRepository: IBranchRepository,
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
        @inject("IKafkaConnection") kafkaconnection: IKafkaConnection,
        @inject("IBranchProducer") createBranchProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<IBranches>>

    ) {
        this.branchRepository = branchRepository
        this.subscriptionRepository = subscriptionRepository
        this.kafkaConnection = kafkaconnection
        this.createBranchProducer = createBranchProducer
    }

    async createBranch(tenantId: string, body: Partial<IBranches>) {


        const locExist = await this.branchRepository.fetchBranchByLocation(tenantId, body.location as string)

        if (locExist) {
            throw new CustomError("Branch with this location already exist", 409)
        }

        const branchCount = await this.branchRepository.fetchBranchCount(tenantId)
        const allowedBranchCount = await this.subscriptionRepository.fetchAllowedBranchCount(new mongoose.Types.ObjectId(tenantId))

        if (branchCount >= allowedBranchCount) {
            throw new CustomError("You have reached the maximum number of branches allowed for your subscription", 400)

        }


        body.branch_id = '#branch' + new Date().getTime() + Math.floor(Math.random() * 1000)

        const branch = await this.branchRepository.create(body as IBranches, tenantId);
        let producer = await this.kafkaConnection.getProducerInstance()
        let branchProducer = this.createBranchProducer(producer, tenantId, 'branches')
        branchProducer.sendMessage('create', branch)
    }

    async deleteBranch(tenantId:string,branchId:mongoose.Types.ObjectId) {

        const branch = await this.branchRepository.delete(tenantId, branchId);
        if (!branch) {
            throw new CustomError("branch not found",404)
        }
        let producer = await this.kafkaConnection.getProducerInstance()
        let branchProducer = this.createBranchProducer(producer, tenantId, 'branches')
        branchProducer.sendMessage('update', branch)
    }
}