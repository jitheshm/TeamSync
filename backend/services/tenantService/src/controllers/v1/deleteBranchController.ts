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

let branchRepository: IBranchRepository = new BranchRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {


        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }
        const branchId = new mongoose.Types.ObjectId(req.params.branchId)

        const branch = await branchRepository.delete(req.user?.decode?.tenantId, branchId);
        if (!branch) {
            return res.status(404).json({ message: "branch not found" })
        }
        let producer = await kafkaConnection.getProducerInstance()
        let branchProducer = new BranchProducer(producer, req.user?.decode?.tenantId, 'branches')
        branchProducer.sendMessage('update', branch)

        res.status(201).json({ message: "branch delete successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}