import { NextFunction, Request, Response } from "express";
import IDecodedUser from "../../../interfaces/IDecodeUser";

export default interface IUserController {
    firebaseLogin(req: Request, res: Response, next: NextFunction): Promise<void>
    forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    login(req: Request, res: Response, next: NextFunction): Promise<void>
    newToken(req: Request, res: Response, next: NextFunction): Promise<void>
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    resetPassword(req: Request & Partial<{
        user: IDecodedUser;
    }>, res: Response, next: NextFunction): Promise<void>
    tenantLogin(req: Request, res: Response, next: NextFunction): Promise<void>
}