
import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import { KafkaConnection } from "../config/kafka/KafkaConnection";
import ProjectService from "../services/implementations/ProjectService";

const projectRepository: IProjectRepository = new ProjectRepository();
const kafkaConnection = new KafkaConnection();
const projectService = new ProjectService({ projectRepository, kafkaConnection });

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
            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must be provided" });
            }
        }

        const newProject = await projectService.createProject(req.body as Partial<IProjects>, req.user?.decode?.tenantId as string);
        res.status(201).json({ message: "Project added successfully", data: newProject });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
