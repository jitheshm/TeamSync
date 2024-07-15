import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { IProjectService } from "../services/interfaces/IProjectService";
import TenantRepository from "../repository/implementations/TenantRepository";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import ProjectService from "../services/implementations/ProjectService";

const tenantRepository: ITenantRepository = new TenantRepository();
const projectRepository: IProjectRepository = new ProjectRepository();
const projectService: IProjectService = new ProjectService(tenantRepository, projectRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }

        const tenantId = req.user.decode.tenantId;
        const projectId = new mongoose.Types.ObjectId(req.params.projectId);
        const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);

        const tenant = await projectService.getTenantById(tenantId);
        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        const availableUsers = await projectService.fetchProjectUsers(tenantId, projectId, branchId);
        if (availableUsers) {
            res.status(200).json({ data: availableUsers });
        } else {
            res.status(404).json({ error: "Users not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
