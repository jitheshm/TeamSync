import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ITenantController {
    createTenant(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}