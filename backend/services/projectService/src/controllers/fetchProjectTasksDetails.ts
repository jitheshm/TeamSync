import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import TaskRepository from "../repository/implementations/TaskRepository";



const taskRepository: ITaskRepository = new TaskRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {



        req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)




        const resultObj = await taskRepository.fetchSpecificTaskDetails(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.taskId), new mongoose.Types.ObjectId(req.user?.decode?.branchId as string));

        res.status(200).json({ message: "project fetch successfully", data: resultObj });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}