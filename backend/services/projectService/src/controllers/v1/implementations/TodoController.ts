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

}