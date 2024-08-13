import { NextFunction, Request, Response } from "express";

export default interface IAdminController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>
    newToken(req: Request, res: Response, next: NextFunction): Promise<void>
}