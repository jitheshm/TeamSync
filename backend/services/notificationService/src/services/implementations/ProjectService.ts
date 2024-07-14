import mongoose from "mongoose";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import { sendMail } from "../../utils/projectMailService";
import { IProjectService } from "../interfaces/IProjectService";

export default class ProjectService implements IProjectService {
    private tenantUserRepository: ITenantUserRepository;

    constructor(tenantUserRepository: ITenantUserRepository) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async handleCreateProjectEvent(dataObj: any): Promise<void> {
        try {
            const developers = dataObj.data.developers_id.map((id: any) => new mongoose.Types.ObjectId(id));
            const testers = dataObj.data.testers_id.map((id: any) => new mongoose.Types.ObjectId(id));
            const manager = new mongoose.Types.ObjectId(dataObj.data.project_manager_id);
            const members = [...developers, ...testers, manager];

            const users = await this.tenantUserRepository.fetchTenantUsersByIds(dataObj.dbName, members);
            const emails = users.map((user: any) => user.email);

            // Send email using projectMailService
            await sendMail(emails, dataObj.data.name, dataObj.data.description);
            console.log("Mail sent successfully");
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle create project event");
        }
    }

}
