import mongoose from "mongoose";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { ITaskService } from "../interfaces/ITaskService";
import { sendMail } from "../../utils/TaskMailService";

export default class TaskService implements ITaskService {
    private tenantUserRepository: ITenantUserRepository;

    constructor(tenantUserRepository: ITenantUserRepository) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async handleCreateTaskEvent(dataObj: any): Promise<void> {
        try {
            const developer = new mongoose.Types.ObjectId(dataObj.data.developer_id);
            const tester = new mongoose.Types.ObjectId(dataObj.data.tester_id);
            const members = [developer, tester];

            const users = await this.tenantUserRepository.fetchTenantUsersByIds(dataObj.dbName, members);
            const emails = users.map((user: any) => user.email);

            // Send email using projectMailService
            await sendMail(emails, dataObj.data.title, dataObj.data.description);
            console.log("Mail sent successfully");
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle create Task event");
        }
    }

}
