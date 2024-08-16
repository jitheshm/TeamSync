import { inject, injectable } from "inversify";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";

@injectable()
export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(
        @inject("IUserRepository") userRepository: IUserRepository
    ) {
        this.userRepository = userRepository
    }

    async handleKafkaEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':

                await this.userRepository.create(data)
                break;
            case 'update':
                await this.userRepository.updateUser(data)
                break;
        }
    }
}