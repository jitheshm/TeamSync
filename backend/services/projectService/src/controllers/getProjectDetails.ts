// src/controllers/projectController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { IProjectService } from "../services/interfaces/IProjectService";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import ProjectService from "../services/implementations/ProjectService";

const projectService: IProjectService = new ProjectService({ projectRepository: new ProjectRepository() });

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        if (req.user?.decode?.role !== 'Tenant_Admin') {
            if (req.user?.decode?.role !== 'Manager' && req.user?.decode?.role !== 'Project_Manager' && req.user?.decode?.role !== 'Developer' && req.user?.decode?.role !== 'Tester') {
                return res.status(401).json({ error: "Unauthorized" });
            }
            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must be provided" });
            }
        }

        const resultObj = await projectService.fetchSpecificProjectDetails(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.params.projectId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));
        res.status(200).json({ message: "Project fetched successfully", data: resultObj });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
