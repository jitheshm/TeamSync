import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ITenantUserController {
    fetchAvailableTenantUsers(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}