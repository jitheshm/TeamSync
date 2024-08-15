import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { CustomError, CustomRequest, UnauthorizedError } from "teamsync-common";
import { ITicketService } from "../../../services/interfaces/ITicketService";
import { ITicketController } from "../interfaces/ITicketController";
import mongoose from "mongoose";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { ITickets } from "../../../entities/TicketEntity";


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

    async fetchTicketStats(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
            const userId = new mongoose.Types.ObjectId(req.user?._id)

            const result = await this.ticketService.fetchTicketStats(req.user?.decode.tenantId, branchId, userId)
            res.status(200).json({ message: "project fetch successfully", data: result });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async createTicket(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const user = req.user as IDecodedUser;
            const bodyObj: Partial<ITickets> = req.body as Partial<ITickets>;
            const projectId: string = req.params.projectId;
            const taskId: string = req.params.taskId;


            if (user.decode?.role !== 'Tenant_Admin') {
                if (user.decode?.role !== 'Tester') {
                    throw new UnauthorizedError()
                }
            }

            const newTicket = await this.ticketService.createTicket(user, bodyObj, projectId, taskId);

            res.status(201).json({ message: "Ticket added successfully", newTicket });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async deleteTicket(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const resultObj = await this.ticketService.deleteTicket(new mongoose.Types.ObjectId(req.params.ticketId), req.user?.decode?.tenantId);

            if (!resultObj) {
                throw new CustomError("Ticket not found", 404);
            }

            res.status(200).json({ message: "Ticket deleted successfully" });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async updateTicket(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const bodyObj = req.body
            const resultObj = await this.ticketService.updateTicket(req.params.ticketId, bodyObj, req.user?.decode?.tenantId);
            if (!resultObj) {
                throw new CustomError("Ticket not found", 404);
            }

            res.status(200).json({ message: "Task updated successfully", task: resultObj });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }



}