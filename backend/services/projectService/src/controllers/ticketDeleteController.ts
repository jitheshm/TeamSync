
import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import TicketRepository from "../repository/implementations/TicketRepository";
import TicketService from "../services/implementations/TicketService";


const ticketRepository: ITicketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const resultObj = await ticketService.deleteTicket(new mongoose.Types.ObjectId(req.params.ticketId), req.user?.decode?.tenantId);

        if (!resultObj) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
