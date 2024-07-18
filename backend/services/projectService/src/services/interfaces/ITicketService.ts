import mongoose from "mongoose";
import { ITickets } from "../../entities/TicketEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";

export interface ITicketService {
    createTicket(user: IDecodedUser, body: Partial<ITickets>, projectId: string, taskId: string): Promise<ITickets>
    updateTicket(ticketId: string, bodyObj: Partial<ITickets & { oldImageUrl: string[] }>, tenantId: string): Promise<ITickets | null>
    updateStatus(ticketId: string, bodyObj: Partial<ITickets>, tenantId: string): Promise<ITickets | null>
    deleteTicket(taskId: mongoose.Types.ObjectId, tenantId: string): Promise<boolean>
    fetchProjectAllTickets(tenantId: string, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITickets & mongoose.Document)[], totalCount: number }>
}