import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import TicketRepository from "../repository/implementations/TicketRepository";
import { ITicketService } from "../services/interfaces/ITicketService";
import TicketService from "../services/implementations/TicketService";


const ticketRepository: ITicketRepository = new TicketRepository();
const ticketService: ITicketService = new TicketService(ticketRepository);

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const resultObj = await ticketService.fetchSpecificTicketDetails(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.params.ticketId));

        res.status(200).json({ message: "ticket fetched successfully", data: resultObj });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
