import { Request, Response } from "express";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { validationResult } from "express-validator";
import { IBranches } from "../../entities/BranchEntity";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import BranchProducer from "../../events/kafka/producers/BranchProducer";
import TenantRepository from "../../repository/implementations/TenantRepository";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";

let branchRepository: IBranchRepository = new BranchRepository()
let tenantRepository: ITenantRepository = new TenantRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        
        const locExist = await branchRepository.fetchBranchByLocation(req.user?.decode?.tenantId, req.body.location)

        if (locExist) {
            return res.status(409).json({ error: "Branch with this location already exist" });
        }

        // const branchCount= await branchRepository.fetchBranchCount(req.user?.decode?.tenantId)

        const bodyObj: Partial<IBranches> = req.body as Partial<IBranches>;
        bodyObj.branch_id = '#branch' + new Date().getTime() + Math.floor(Math.random() * 1000)

        const branch = await branchRepository.create(bodyObj as IBranches, req.user?.decode?.tenantId);
        let producer = await kafkaConnection.getProducerInstance()
        let branchProducer = new BranchProducer(producer, req.user?.decode?.tenantId, 'branches')
        branchProducer.sendMessage('create', branch)

        res.status(201).json({ message: "branch created successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}