import mongoose from "mongoose";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { IMeetingService } from "../interfaces/IMeetingService";
import { sendMail } from "../../utils/meetingMailService";
import { inject, injectable } from "inversify";

@injectable()
export default class MeetingService implements IMeetingService {
    private tenantUserRepository: ITenantUserRepository;

    constructor(
        @inject("ITenantUserRepository") tenantUserRepository: ITenantUserRepository
    ) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async handleCreateMeetingEvent(dataObj: any): Promise<void> {
        try {
            const participants = dataObj.data.participants.map((id: any) => new mongoose.Types.ObjectId(id));
            const scheduler = new mongoose.Types.ObjectId(dataObj.data.scheduledBy);
            const members = [...participants, scheduler];

            const users = await this.tenantUserRepository.fetchTenantUsersByIds(dataObj.dbName, members);
            const emails = users.map((user: any) => user.email);

            await sendMail(emails, dataObj.data.name, dataObj.data.meetingDate, dataObj.data.meetingTime, dataObj.data.meetingLink);
            console.log("Mail sent successfully");
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle create meeting event");
        }
    }

}
