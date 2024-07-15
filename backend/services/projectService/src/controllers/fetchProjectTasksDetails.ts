import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import TaskService from "../services/implementations/TaskService";
import { ITaskService } from "../services/interfaces/ITaskService";

const taskRepository: ITaskRepository = new TaskRepository();
const taskService: ITaskService = new TaskService(taskRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);

        const resultObj = await taskService.fetchSpecificTaskDetails(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.params.taskId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));

        res.status(200).json({ message: "Task fetched successfully", data: resultObj });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
