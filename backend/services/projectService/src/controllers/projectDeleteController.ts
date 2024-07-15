// src/controllers/projectController.ts

import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import { IKafkaConnection } from "../interfaces/IKafkaConnection";
import { KafkaConnection } from "../config/kafka/KafkaConnection";
import ProjectService from "../services/implementations/ProjectService";

const projectRepository: IProjectRepository = new ProjectRepository();
const kafkaConnection: IKafkaConnection = new KafkaConnection();
const projectService = new ProjectService({projectRepository, kafkaConnection});

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

        const deletedProject = await projectService.deleteProject(req.body as Partial<IProjects>, req.user?.decode?.tenantId as string, req.params.projectId);
        
        if (!deletedProject) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully", data: deletedProject });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
