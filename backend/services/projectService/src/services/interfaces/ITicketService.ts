import mongoose from "mongoose";
import { ITickets } from "../../entities/TicketEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";

export interface ITicketService {
    createTicket(user: IDecodedUser, body: Partial<ITickets>, projectId: string, taskId: string): Promise<ITickets>
    updateTicket(ticketId: string, bodyObj: Partial<ITickets & { oldImageUrl: string[] }>, tenantId: string): Promise<ITickets | null>
    updateStatus(ticketId: string, bodyObj: Partial<ITickets>, tenantId: string): Promise<ITickets | null>
    deleteTicket(taskId: mongoose.Types.ObjectId, tenantId: string): Promise<boolean>
    fetchTaskAllTickets(tenantId: string, taskId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITickets & mongoose.Document)[], totalCount: number }>
    fetchSpecificTicketDetails(tenantId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null>
    fetchTicketStats(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<(any)[]>
}