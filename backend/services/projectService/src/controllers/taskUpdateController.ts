import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProjects } from "../entities/ProjectEntity";
import ProjectRepository from "../repository/implementations/ProjectRepository";
import { IProjectRepository } from "../repository/interfaces/IProjectRepository";
import { ITasks } from "../entities/TaskEntity";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import TaskRepository from "../repository/implementations/TaskRepository";



let taskRepository:ITaskRepository = new TaskRepository();

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        

        const bodyObj: Partial<ITasks> = req.body as Partial<ITasks>;
        bodyObj.branch_id=new mongoose.Types.ObjectId(req.user?.decode.branchId);

        const resultObj = await taskRepository.update(bodyObj as ITasks, req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.taskId));

        res.status(200).json({ message: "task updated successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}