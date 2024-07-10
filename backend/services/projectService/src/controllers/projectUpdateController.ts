import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import ProjectProducer from "../events/kafka/producers/ProjectProducer";
import { IKafkaConnection } from "../interfaces/IKafkaConnection";
import { KafkaConnection } from "../config/kafka/KafkaConnection";



const projectRepository: IProjectRepository = new ProjectRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        if (req.user?.decode?.role !== 'Tenant_Admin') {

            if (req.user?.decode?.role !== 'Manager') {
                return res.status(401).json({ error: "Unauthorized" });
            }

            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)

        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must needed" });
            }
        }

        const bodyObj: Partial<IProjects> = req.body as Partial<IProjects>;

        const resultObj = await projectRepository.update(bodyObj as IProjects, req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.projectId));

        if (!resultObj) {
            return res.status(404).json({ error: "Project not found" });
        }
        let producer = await kafkaConnection.getProducerInstance()
        let tenantProjectProducer = new ProjectProducer(producer, req.user?.decode?.tenantId, 'projects')
        tenantProjectProducer.sendMessage('update', resultObj)


        res.status(200).json({ message: "project updated successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}