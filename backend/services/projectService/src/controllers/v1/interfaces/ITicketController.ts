import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ITicketController {
    fetchProjectTickets(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTicketDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTicketStats(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createTicket(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    deleteTicket(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    updateTicket(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    TicketUpdateStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}