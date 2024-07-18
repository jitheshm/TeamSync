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
    async updateTicket(ticketId: string, bodyObj: Partial<ITickets & { oldImageUrl: string[] }>, tenantId: string): Promise<ITickets | null> {
        try {
            const resultObj = await this.ticketRepostitory.update(bodyObj, tenantId, new mongoose.Types.ObjectId(ticketId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async updateStatus(ticketId: string, bodyObj: Partial<ITickets>, tenantId: string): Promise<ITickets | null> {
        try {
            const resultObj = await this.ticketRepostitory.updateStatus(bodyObj, tenantId, new mongoose.Types.ObjectId(ticketId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async deleteTicket(taskId: mongoose.Types.ObjectId, tenantId: string): Promise<boolean> {
        try {
            const result = await this.ticketRepostitory.delete(tenantId, taskId);
            return !!result;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async fetchTaskAllTickets(tenantId: string, taskId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITickets & mongoose.Document)[], totalCount: number }> {
        return await this.ticketRepostitory.fetchTaskAllTickets(tenantId, taskId, search, page, limit);
    }

    async fetchSpecificTicketDetails(tenantId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null> {
        return await this.ticketRepostitory.fetchSpecificTicketDetails(tenantId, ticketId);
    }

} 