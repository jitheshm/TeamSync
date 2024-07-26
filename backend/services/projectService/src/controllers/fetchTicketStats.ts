import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import IDecodedUser from "../interfaces/IDecodeUser";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import TicketRepository from "../repository/implementations/TicketRepository";
import { ITicketService } from "../services/interfaces/ITicketService";
import TicketService from "../services/implementations/TicketService";

const ticketRepository: ITicketRepository = new TicketRepository()
const ticketService: ITicketService = new TicketService(ticketRepository)

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string);
        const userId = new mongoose.Types.ObjectId(req.user?._id)

        const result = await ticketService.fetchTicketStats(req.user?.decode.tenantId, branchId, userId)


        res.status(200).json({ message: "project fetch successfully", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
