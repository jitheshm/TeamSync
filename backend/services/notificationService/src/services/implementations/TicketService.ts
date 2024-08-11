import mongoose from "mongoose";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { ITicketService } from "../interfaces/ITicketService";
import { sendBugTicketMail } from "../../utils/TicketMailService";

export default class TicketService implements ITicketService {
    private tenantUserRepository: ITenantUserRepository;

    constructor(tenantUserRepository: ITenantUserRepository) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async handleCreateTicketEvent(dataObj: any): Promise<void> {
        try {
            const developer = new mongoose.Types.ObjectId(dataObj.data.developer_id);
            const members = [developer];

            const users = await this.tenantUserRepository.fetchTenantUsersByIds(dataObj.dbName, members);
            const emails = users.map((user: any) => user.email);

            await sendBugTicketMail(emails, dataObj.data.newTicket.title, dataObj.data.newTicket.description);
            console.log("Mail sent successfully");
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle create Ticket event");
        }
    }

}
