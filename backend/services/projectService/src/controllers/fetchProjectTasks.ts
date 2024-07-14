import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import { ITaskService } from "../services/interfaces/ITaskService";
import TaskService from "../services/implementations/TaskService";

const taskRepository: ITaskRepository = new TaskRepository();
const taskService: ITaskService = new TaskService(taskRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const search = req.query.search as string | null;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 1000);

        const data = await taskService.fetchProjectAllTask(
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
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
