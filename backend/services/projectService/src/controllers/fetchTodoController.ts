import { Request, Response } from "express";
import mongoose from "mongoose";

import IDecodedUser from "../interfaces/IDecodeUser";
import { ITodoRepository } from "../repository/interfaces/ITodoRepository";
import TodoRepository from "../repository/implementations/TodoRepository";
import { ITodoService } from "../services/interfaces/ITodoService";
import TodoService from "../services/implementations/TodoService";
import { ITodo } from "../entities/TodoEntity";


const todoRepository: ITodoRepository = new TodoRepository();
const todoService: ITodoService = new TodoService(todoRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        

        const user = req.user as IDecodedUser;

        const data = await todoService.fetchTodoList(req.user?.decode.tenantId, new mongoose.Types.ObjectId(user._id))
        res.status(200).json({ message: "Todo fetch successfully", data: data })




    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}
