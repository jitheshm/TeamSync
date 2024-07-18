import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import TicketRepository from "../repository/implementations/TicketRepository";
import { ITicketService } from "../services/interfaces/ITicketService";
import TicketService from "../services/implementations/TicketService";


const ticketRepository: ITicketRepository = new TicketRepository();
const ticketServcie: ITicketService = new TicketService(ticketRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const search = req.query.search as string | null;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 1000);

        const data = await ticketServcie.fetchTaskAllTickets(
            req.user?.decode?.tenantId as string,
            new mongoose.Types.ObjectId(req.params.taskId),
            search,
            page,
            limit
        );

        res.status(200).json({ message: "Tasks fetched successfully", data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
