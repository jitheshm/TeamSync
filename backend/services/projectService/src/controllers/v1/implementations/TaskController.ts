import { inject, injectable } from "inversify";
import { ITaskService } from "../../../services/interfaces/ITaskService";
import { ITaskController } from "../interfaces/ITaskController";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { ITasks } from "../../../entities/TaskEntity";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";
import mongoose from "mongoose";

@injectable()
export class TaskController implements ITaskController {
    private taskService: ITaskService;
    constructor(
        @inject("ITaskService") taskService: ITaskService
    ) {
        this.taskService = taskService;

    }

    async createTask(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IDecodedUser;
            const bodyObj: Partial<ITasks> = req.body as Partial<ITasks>;
            const projectId: string = req.params.projectId;
            const newProject = await this.taskService.createTask(user, bodyObj, projectId);
            res.status(201).json({ message: "Task added successfully", newProject });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchProjectTasks(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string | null;
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 1000);

            const data = await this.taskService.fetchProjectAllTask(
                req.user?.decode?.tenantId as string,
                new mongoose.Types.ObjectId(req.user?.decode?.branchId as string),
                new mongoose.Types.ObjectId(req.params.projectId),
                search,
                page,
                limit
            );

            res.status(200).json({ message: "Tasks fetched successfully", data: data });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchProjectTaskDetails(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
            const resultObj = await this.taskService.fetchSpecificTaskDetails(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.params.taskId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));
            res.status(200).json({ message: "Task fetched successfully", data: resultObj });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchTaskStats(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
            const userId = new mongoose.Types.ObjectId(req.user?._id)

            const result = await this.taskService.fetchTaskStats(req.user?.decode.tenantId, branchId, userId)


            res.status(200).json({ message: "project fetch successfully", data: result });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

}