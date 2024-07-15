import { Document } from "mongoose";
import ChatRepository from "../../repository/implementations/ChatRepository";
import IChats from "../../entities/ChatEntity";
import mongoose from "mongoose";
import { IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";

export default class ProjectService implements IProjectService {
    private projectRepository: IProjectRepository;
    private chatRepository: IChatRepository;

    constructor(projectRepository: IProjectRepository, chatRepository: IChatRepository) {
        this.projectRepository = projectRepository;
        this.chatRepository = chatRepository;
    }

    async handleEvent(eventType: string, data: any, dbName: string): Promise<void> {
        try {
            switch (eventType) {
                case "create": {
                    const project = await this.projectRepository.create(data, dbName);

                    const developers = data.developers_id.map((id: any) => new mongoose.Types.ObjectId(id));
                    const testers = data.testers_id.map((id: any) => new mongoose.Types.ObjectId(id));
                    const chatData: IChats = {
                        name: data.name,
                        group_id: data._id,
                        type: 'group',
                        members: [...developers, ...testers, new mongoose.Types.ObjectId(data.project_manager_id)],
                    };

                    await this.chatRepository.create(dbName, chatData);
                    break;
                }
                case "update":
                    await this.projectRepository.update(data, dbName, data._id);
                    break;
                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle project event");
        }
    }

}
