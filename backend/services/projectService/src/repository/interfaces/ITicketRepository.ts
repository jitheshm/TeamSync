import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITickets } from "../../entities/TicketEntity";


export interface ITicketRepository {
    create(data: ITickets, dbId: string): Promise<ITickets & Document>
    fetchSpecificTicket(dbId: string, ticketId: mongoose.Types.ObjectId): Promise<(ITickets & Document) | null>
    update(data: Partial<ITickets & { oldImageUrl: string[] }>, dbId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null>
    delete(dbId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null>
    fetchTaskAllTickets(dbId: string, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{
        data: (ITickets & Document)[], totalCount: number
    }>
    fetchSpecificTicketDetails(dbId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets & Document>
    updateStatus(data: Partial<ITickets>, tenantId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null>
    fetchTicketStats(dbId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<any[]>



}