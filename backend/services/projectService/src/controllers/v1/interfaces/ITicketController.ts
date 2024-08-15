import { NextFunction,Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ITicketController {
    fetchProjectTickets(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTicketDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTicketStats(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}