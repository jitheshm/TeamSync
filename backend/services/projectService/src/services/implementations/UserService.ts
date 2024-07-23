// src/services/implementations/UserService.ts

import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { IUsers } from "../../entities/UserEntity";
import { Document } from "mongoose";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: IUsers): Promise<void> {
        await this.userRepository.create(data);
    }

    async updateUser(data: IUsers & Document): Promise<void> {
        await this.userRepository.updateUser(data);
    }

    async handleKafkaEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.createUser(data);
                break;
            case 'update':
                await this.updateUser(data);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }
    }
}
