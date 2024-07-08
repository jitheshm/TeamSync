import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import TaskRepository from "../repository/implementations/TaskRepository";


let taskRepository: ITaskRepository = new TaskRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const search = req.query.search as string | null
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 1000)

        const data = await taskRepository.fetchProjectAllTask(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId as string), new mongoose.Types.ObjectId(req.params.projectId), search, page, limit)

        res.status(200).json({ message: "Tasks fetched successfully", data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}