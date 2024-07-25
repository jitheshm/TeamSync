import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import { IProjectService } from "../services/interfaces/IProjectService";
import ProjectService from "../services/implementations/ProjectService";

const projectRepository: IProjectRepository = new ProjectRepository();
const projectService: IProjectService = new ProjectService({ projectRepository });

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        const projects = await projectService.fetchRecentProjects(req.user?.decode.tenantId, branchId);
        console.log(projects);


        res.status(200).json({ message: "project fetch successfully", data: projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
