import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import { IProjectService } from "../services/interfaces/IProjectService";
import ProjectService from "../services/implementations/ProjectService";

const projectRepository: IProjectRepository = new ProjectRepository();
const projectService: IProjectService = new ProjectService({projectRepository});

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        if (req.user?.decode?.role !== 'Tenant_Admin') {
            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must needed" });
            }
        }

        const search = req.query.search as string | null;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 1000);
        let resultObj: { data: (IProjects & Document)[], totalCount: number };

        if (req.query.pm) {
            resultObj = await projectService.fetchAllPManagerProjects(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string), new mongoose.Types.ObjectId(req.user?._id), search, page, limit);
        } else if (req.query.dev) {
            resultObj = await projectService.fetchAllDeveloperProjects(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string), new mongoose.Types.ObjectId(req.user?._id), search, page, limit);
        } else {
            resultObj = await projectService.fetchAllProject(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string), search, page, limit);
        }

        res.status(200).json({ message: "project fetch successfully", data: resultObj });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
