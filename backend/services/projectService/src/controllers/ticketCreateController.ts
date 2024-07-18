import { Request, Response } from "express";
import mongoose from "mongoose";
import TaskRepository from "../repository/implementations/TaskRepository";
import { ITaskRepository } from "../repository/interfaces/ITaskRepository";
import IDecodedUser from "../interfaces/IDecodeUser";
;
import { validationResult } from "express-validator";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import { ITickets } from "../entities/TicketEntity";
import TicketRepository from "../repository/implementations/TicketRepository";
import TicketService from "../services/implementations/TicketService";
import { ITicketService } from "../services/interfaces/ITicketService";
import { FileArray } from "express-fileupload";

const ticketRepository: ITicketRepository = new TicketRepository();
const ticketService: ITicketService = new TicketService(ticketRepository);

export default async (req: Request & Partial<{
    user: IDecodedUser,
    files: FileArray | null | undefined;
    uploadedFiles?: string[];
}>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const user = req.user as IDecodedUser;
        const bodyObj: Partial<ITickets> = req.body as Partial<ITickets>;
        const projectId: string = req.params.projectId;
        const taskId: string = req.params.taskId;
        if (req.uploadedFiles)
            bodyObj.upload_images = req.uploadedFiles

        if (user.decode?.role !== 'Tenant_Admin') {
            if (user.decode?.role !== 'Tester') {
                throw new Error("Unauthorized");
            }
        }

        try {

            const newTicket = await ticketService.createTicket(user, bodyObj, projectId, taskId);

            res.status(201).json({ message: "Ticket added successfully", newTicket });
        } catch (error: any) {
            if (error.message === "Unauthorized") {
                return res.status(401).json({ error: error.message });
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}
