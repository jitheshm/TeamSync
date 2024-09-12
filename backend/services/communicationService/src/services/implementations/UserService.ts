import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(
        @inject("IUserRepository") userRepository: IUserRepository
    ) {
        this.userRepository = userRepository;
    }

    async handleEvent(eventType: string, data: any): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                    await this.userRepository.create(data);
                    break;
                case "update":
                    await this.userRepository.updateUser(data);
                    break;
                default:
                    console.log(`Unsupported event type: ${eventType}`);

            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle user event");
        }
    }

}
