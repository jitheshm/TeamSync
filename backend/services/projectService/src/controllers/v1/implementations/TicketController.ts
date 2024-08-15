import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "teamsync-common";
import { ITicketService } from "../../../services/interfaces/ITicketService";
import { ITicketController } from "../interfaces/ITicketController";
import mongoose from "mongoose";


@injectable()
export class TicketController implements ITicketController {
    private ticketService: ITicketService;

    constructor(
        @inject("ITicketService") ticketService: ITicketService
    ) {
        this.ticketService = ticketService;

    }

    async fetchProjectTickets(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string | null;
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 1000);

            const data = await this.ticketService.fetchTaskAllTickets(
                req.user?.decode?.tenantId as string,
                new mongoose.Types.ObjectId(req.params.taskId),
                search,
                page,
                limit
            );

            res.status(200).json({ message: "Tasks fetched successfully", data: data });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchTicketDetails(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const resultObj = await this.ticketService.fetchSpecificTicketDetails(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.params.ticketId));

            res.status(200).json({ message: "ticket fetched successfully", data: resultObj });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

}