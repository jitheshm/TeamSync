import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import { ITasks } from "../entities/TaskEntity";




const taskRepository: ITaskRepository = new TaskRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        // const result = validationResult(req);
        // if (!result.isEmpty()) {
        //     return res.status(400).json({ errors: result.array() });
        // }

        if (req.user?.decode?.role !== 'Tenant_Admin') {

            if (req.user?.decode?.role !== 'Project_Manager') {
                return res.status(401).json({ error: "Unauthorized" });
            }

            req.body.branch_id = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)

        } else {
            if (!req.body.branch_id) {
                return res.status(400).json({ errors: "Branch id must needed" });
            }
        }

        const bodyObj: Partial<ITasks> = req.body as Partial<ITasks>;
        bodyObj.task_id = '#task' + new Date().getTime() + Math.floor(Math.random() * 1000)
        // bodyObj.project_manager_id = new mongoose.Types.ObjectId(req.user._id)
        bodyObj.project_id = new mongoose.Types.ObjectId(req.params.projectId)

        const newProject = await taskRepository.create(bodyObj as ITasks, req.user?.decode?.tenantId);

        res.status(201).json({ message: "Task added successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}