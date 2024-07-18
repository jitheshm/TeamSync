import mongoose from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITicketRepository } from "../../repository/interfaces/ITicketRepository";
import { ITickets } from "../../entities/TicketEntity";
import { ITicketService } from "../interfaces/ITicketService";

export default class TicketService implements ITicketService {

    private ticketRepostitory: ITicketRepository;

    constructor(ticketRepository: ITicketRepository) {
        this.ticketRepostitory = ticketRepository;
    }

    async createTicket(user: IDecodedUser, body: Partial<ITickets>, projectId: string, taskId: string): Promise<ITickets> {

        body.ticket_id = '#ticket' + new Date().getTime() + Math.floor(Math.random() * 1000);
        body.project_id = new mongoose.Types.ObjectId(projectId);
        body.task_id = new mongoose.Types.ObjectId(taskId);

        return await this.ticketRepostitory.create(body as ITickets, user.decode?.tenantId);
    }
    async updateTicket(ticketId: string, bodyObj: Partial<ITickets & {oldImageUrl:string[]}>, tenantId: string): Promise<ITickets | null> {
        try {
            const resultObj = await this.ticketRepostitory.update(bodyObj, tenantId, new mongoose.Types.ObjectId(ticketId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}