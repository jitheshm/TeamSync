import { ITickets } from "../../entities/TicketEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";

export interface ITicketService {
    createTicket(user: IDecodedUser, body: Partial<ITickets>, projectId: string, taskId: string): Promise<ITickets>
}