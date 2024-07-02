import { Request, Response } from "express";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { validationResult } from "express-validator";
import { IBranches } from "../../entities/BranchEntity";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import BranchProducer from "../../events/kafka/producers/BranchProducer";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";

let branchRepository: IBranchRepository = new BranchRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()
let tenantRepository: ITenantRepository = new TenantRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const branchId = new mongoose.Types.ObjectId(req.params.branchId)
        const bodyObj: Partial<IBranches> = req.body as Partial<IBranches>;

        const branch = await branchRepository.update(bodyObj as IBranches, req.user?.decode?.tenantId, branchId);
        if (!branch) {
            return res.status(404).json({ message: "branch not found" })
        }
        let producer = await kafkaConnection.getProducerInstance()
        let branchProducer = new BranchProducer(producer, req.user?.decode?.tenantId, 'branches')
        branchProducer.sendMessage('update', branch)

        res.status(201).json({ message: "branch updated successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}