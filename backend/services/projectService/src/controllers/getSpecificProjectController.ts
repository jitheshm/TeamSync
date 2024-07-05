import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";



const projectRepository: IProjectRepository = new ProjectRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

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


        const resultObj = await projectRepository.fetchSpecificProject(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.projectId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));

        res.status(200).json({ message: "project fetch successfully", data: resultObj });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}