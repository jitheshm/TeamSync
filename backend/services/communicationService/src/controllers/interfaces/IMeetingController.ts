import { NextFunction, Request, Response } from "express";
import IDecodedUser from "../../interfaces/IDecodeUser";

export interface IMeetingController {
    createMeeting(req: Request & Partial<{
        user: IDecodedUser;
    }>, res: Response, next: NextFunction): Promise<void>
}