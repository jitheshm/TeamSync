import { inject, injectable } from "inversify";
import { ITodoService } from "../../../services/interfaces/ITodoService";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";
import { ITodoController } from "../interfaces/ITodoController";
import mongoose from "mongoose";
import { ITodo } from "../../../entities/TodoEntity";

@injectable()
export class TodoController implements ITodoController {
    private todoService: ITodoService;

    constructor(
        @inject("ITodoService") todoService: ITodoService
    ) {
        this.todoService = todoService;

    }

    async createTodo(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IDecodedUser;
            const bodyObj: Partial<ITodo> = req.body as Partial<ITodo>;
            const data = {
                ...bodyObj,
                user_id: new mongoose.Types.ObjectId(user._id)
            }
            await this.todoService.createTodo(data, req.user?.decode.tenantId)
            res.status(201).json({ message: "Todo created successfully" })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchTodo(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IDecodedUser;

            const data = await this.todoService.fetchTodoList(req.user?.decode.tenantId, new mongoose.Types.ObjectId(user._id))
            res.status(200).json({ message: "Todo fetch successfully", data: data })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async updateTodo(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const user = req.user as IDecodedUser;
            const bodyObj: Partial<ITodo> = req.body as Partial<ITodo>;
            const todoId = new mongoose.Types.ObjectId(req.params.todoId)

            await this.todoService.updateTodo(bodyObj, req.user?.decode.tenantId, todoId)
            res.status(200).json({ message: "Todo updated successfully" })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

}