import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ITodoController {
    createTodo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTodo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    updateTodo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}