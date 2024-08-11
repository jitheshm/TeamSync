import { Request, Response } from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITasks } from "../entities/TaskEntity";
import { ITaskService } from "../services/interfaces/ITaskService";
import TaskService from "../services/implementations/TaskService";
import { IKafkaConnection } from "../interfaces/IKafkaConnection";
import { KafkaConnection } from "../config/kafka/KafkaConnection";

const taskRepository: ITaskRepository = new TaskRepository();
const kafkaConnection:IKafkaConnection = new KafkaConnection();
const taskService: ITaskService = new TaskService(taskRepository,kafkaConnection);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const user = req.user as IDecodedUser;
        const bodyObj: Partial<ITasks> = req.body as Partial<ITasks>;
        const projectId: string = req.params.projectId;

        try {
            const newProject = await taskService.createTask(user, bodyObj, projectId);
            res.status(201).json({ message: "Task added successfully", newProject });
        } catch (error:any) {
            if (error.message === "Unauthorized") {
                return res.status(401).json({ error: error.message });
            } else if (error.message === "Branch id must needed") {
                return res.status(400).json({ errors: error.message });
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}
