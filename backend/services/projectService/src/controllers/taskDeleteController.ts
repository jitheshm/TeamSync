
import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import { ITasks } from "../entities/TaskEntity";
import TaskService from "../services/implementations/TaskService";

const taskRepository: ITaskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const bodyObj: Partial<ITasks> = req.body as Partial<ITasks>;
        bodyObj.branch_id = new mongoose.Types.ObjectId(req.user?.decode.branchId);

        const result = await validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const resultObj = await taskService.deleteTask(bodyObj, new mongoose.Types.ObjectId(req.params.taskId), req.user?.decode?.tenantId);

        if (!resultObj) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
