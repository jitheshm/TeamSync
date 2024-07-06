import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";



const projectRepository: IProjectRepository = new ProjectRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        if (req.user?.decode?.role !== 'Tenant_Admin') {

            if (req.user?.decode?.role !== 'Manager' && req.user?.decode?.role !== 'Project_Manager') {
                return res.status(401).json({ error: "Unauthorized" });
            }

            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)

        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must needed" });
            }
        }
        let resultObj: (IProjects & Document)[]
        if (req.query.pm) {

            resultObj = await projectRepository.fetchAllPManagerProjects(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string), new mongoose.Types.ObjectId(req.user._id));

        } else {

            resultObj = await projectRepository.fetchAllProject(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));
        }

        res.status(200).json({ message: "project fetch successfully", data: resultObj });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}