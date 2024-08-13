import { NextFunction, Request, Response } from "express";

export default interface IUserController {
    firebaseLogin(req: Request, res: Response, next: NextFunction): Promise<void>
    forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    login(req: Request, res: Response, next: NextFunction): Promise<void>
    newToken(req: Request, res: Response, next: NextFunction): Promise<void>
}