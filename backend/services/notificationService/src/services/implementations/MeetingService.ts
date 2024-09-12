import mongoose from "mongoose";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { IMeetingService } from "../interfaces/IMeetingService";
import { sendMail } from "../../utils/meetingMailService";
import { inject, injectable } from "inversify";
import cron from "node-cron"
import { sendRemainderMail } from "../../utils/remainderMailService";

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
            console.log(dataObj);


            await sendMail(emails, dataObj.data.meetingTitle, dataObj.data.meetingDate, dataObj.data.meetingTime, dataObj.data.meetingLink);

            this.scheduleReminderEmail(dataObj, emails);
            console.log("Mail sent successfully");
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle create meeting event");
        }
    }

    private scheduleReminderEmail(dataObj: any, emails: string[]): void {
        // Combine meeting date and time
        const meetingDateTime = new Date(`${dataObj.data.meetingDate}T${dataObj.data.meetingTime}`);
        const reminderTime = new Date(meetingDateTime.getTime() - 10 * 60 * 1000); // 10 minutes before the meeting

        const currentTime = new Date();

        if (reminderTime > currentTime) {
            const reminderCronTime = this.convertDateToCron(reminderTime);
            console.log(`Scheduling reminder at: ${reminderCronTime} (IST)`);

            // Schedule cron job with IST timezone
            cron.schedule(
                reminderCronTime,
                async () => {
                    try {
                        await sendRemainderMail(
                            emails,
                            dataObj.data.meetingTitle,
                            dataObj.data.meetingDate,
                            dataObj.data.meetingTime,
                            dataObj.data.meetingLink
                        );
                        console.log("Reminder email sent 10 minutes before the meeting (IST)");
                    } catch (error) {
                        console.log("Failed to send reminder email:", error);
                    }
                },
                {
                    timezone: "Asia/Kolkata" // Ensure the cron job runs in IST
                }
            );
        } else {
            console.log("The meeting is less than 10 minutes away, reminder not scheduled.");
        }
    }

    convertDateToCron(date: Date): string {
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
        const dayOfWeek = '*'; // Can be set to a specific day if needed

        return `${minutes} ${hours} ${day} ${month} ${dayOfWeek}`;
    }

}
