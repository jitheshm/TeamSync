import { Request, Response } from "express";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { validationResult } from "express-validator";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import TenantUserProducer from "../../events/kafka/producers/TenantUserProducer";
import mongoose from "mongoose";

let tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        if (!req.body.role || !req.body.branch_id) {
            return res.status(400).json({ error: "Role and Branch ID must be provided" });
        }

        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }

        if (req.user?.decode?.role !== 'Tenant_Admin') {
            if (req.body.role === 'Manager') {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (req.user?.decode?.role !== 'Manager') {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must needed" });
            }
            //req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)


        }

        const userId = new mongoose.Types.ObjectId(req.params.userId)
        const bodyObj: Partial<ITenantUsers> = req.body as Partial<ITenantUsers>;
        req.body.branch_id = new mongoose.Types.ObjectId(req.body.branch_id as string)

        const tenantUser = await tenantUserRepository.delete(bodyObj, req.user?.decode?.tenantId, userId)

        if (!tenantUser) {
            return res.status(404).json({ error: "User not found" });
        }


        let producer = await kafkaConnection.getProducerInstance()
        let tenantUserProducer = new TenantUserProducer(producer, req.user?.decode?.tenantId, 'tenant_users')
        tenantUserProducer.sendMessage('update', tenantUser)

        res.status(201).json({ message: "user delete successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}