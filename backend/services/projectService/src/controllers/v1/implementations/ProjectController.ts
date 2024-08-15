import { inject, injectable } from "inversify";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { ITasks } from "../../../entities/TaskEntity";
import { NextFunction, Request, Response } from "express";
import { CustomError, CustomRequest, UnauthorizedError } from "teamsync-common";
import { IProjectService } from "../../../services/interfaces/IProjectService";
import { IProjectController } from "../interfaces/IProjectController";
import mongoose from "mongoose";
import { IProjects } from "../../../entities/ProjectEntity";

@injectable()
export class ProjectController implements IProjectController {
    private projectService: IProjectService;

    constructor(
        @inject("IProjectService") projectService: IProjectService
    ) {
        this.projectService = projectService;

    }



    async createProject(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            if (req.user?.decode?.role !== 'Tenant_Admin') {
                if (req.user?.decode?.role !== 'Manager') {
                    throw new UnauthorizedError()
                }
                req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
            } else {
                if (!req.body.branch_id) {
                    throw new CustomError("Branch id must be provided", 400)
                }
            }

            const newProject = await this.projectService.createProject(req.body as Partial<IProjects>, req.user?.decode?.tenantId as string);
            res.status(201).json({ message: "Project added successfully", data: newProject });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchBranchProjectCount(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const period: 'week' | 'month' | '6month' | 'year' = req.query.period as 'week' | 'month' | '6month' | 'year';
            console.log(period);

            const projects = await this.projectService.fetchBranchProjectsCount(req.user?.decode.tenantId, period);
            console.log(projects);

            res.status(200).json({ message: "project count successfully", data: projects });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchBranchRecentProjects(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const pmId = req.query.pmId ? new mongoose.Types.ObjectId(req.query.pmId as string) : undefined
            const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);

            const projects = await this.projectService.fetchRecentProjects(req.user?.decode.tenantId, branchId, pmId);
            console.log(projects);


            res.status(200).json({ message: "project fetch successfully", data: projects });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }



}