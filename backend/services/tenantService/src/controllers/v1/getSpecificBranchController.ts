import { Request, Response } from "express";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { validationResult } from "express-validator";
import { IBranches } from "../../entities/BranchEntity";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import BranchProducer from "../../events/kafka/producers/BranchProducer";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import mongoose from "mongoose";

let branchRepository: IBranchRepository = new BranchRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()
let tenantRepository: ITenantRepository = new TenantRepository()


export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        const tenantId = req.user?.decode?.tenantId;
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }


        const datas = await branchRepository.fetchSpecificBranches(tenantId, new mongoose.Types.ObjectId(req.params.branchId))

        res.status(201).json({ message: "succesfully fetched", data: datas });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}