import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import jwt from 'jsonwebtoken';
import { IUsers } from "../../entities/UserEntity";
import { Document } from "mongoose";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import TenantProducer from "../../events/kafka/producers/TenantProducer";

const tenantRepository: ITenantRepository = new TenantRepository();
let kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request & Partial<{ user: IUsers }>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: Partial<ITenants> = req.body;
        
        console.log(req.user);
        
        bodyObj.user_id = req.user?._id;
        console.log(bodyObj)
        bodyObj.tenant_id = '#tenant' + new Date().getTime() + Math.floor(Math.random() * 1000)
        const tenant = await tenantRepository.create(bodyObj);
        let producer = await kafkaConnection.getProducerInstance()
        let tenantProducer = new TenantProducer(producer, 'main', 'tenants') 
        tenantProducer.sendMessage('create', tenant)
        res.status(201).json({ message: "Tenant created successfully", tenantId: tenant._id });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }

}