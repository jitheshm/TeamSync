import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";

import { ITaskService } from "../services/interfaces/ITaskService";
import TaskService from "../services/implementations/TaskService";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import TaskRepository from "../repository/implementations/TaskRepository";

const taskRepository: ITaskRepository = new TaskRepository()
const taskService: ITaskService = new TaskService(taskRepository)

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        const userId = new mongoose.Types.ObjectId(req.user?._id)

        const result = await taskService.fetchTaskStats(req.user?.decode.tenantId, branchId, userId)


        res.status(200).json({ message: "project fetch successfully", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
