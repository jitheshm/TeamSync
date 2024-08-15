import { inject, injectable } from "inversify";
import { ITaskService } from "../../../services/interfaces/ITaskService";
import { ITaskController } from "../interfaces/ITaskController";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { ITasks } from "../../../entities/TaskEntity";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";

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

}