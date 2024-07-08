import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITenantUserRepository } from "../repository/interfaces/ITenantUserRepository";
import TenantUserRepository from "../repository/implementations/TenantUserRepository";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import ProjectRepository from "../repository/implementations/ProjectRepository";


let tenantRepository: ITenantRepository = new TenantRepository()
let projectRepository: IProjectRepository = new ProjectRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }
        const tenant = await tenantRepository.getTenantById(req.user?.decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        const availableUsers = await projectRepository.fetchProjectUsers(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.projectId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string))

        if (availableUsers) {
            res.status(200).json({ data: availableUsers })
        } else {
            res.status(404).json({ error: "Users not found" })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}