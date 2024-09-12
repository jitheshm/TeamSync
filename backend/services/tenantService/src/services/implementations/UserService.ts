import { inject, injectable } from "inversify";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";

@injectable()
export class UserService implements IUserService {
    private userRepository: IUserRepository

    constructor(
        @inject("IUserRepository") userRepository: IUserRepository
    ) {
        this.userRepository = userRepository
    }

    async handleKafkaEvent(dataObj: any) {

        switch (dataObj.eventType) {
            case 'create':

                await this.userRepository.create(dataObj.data)
                break;
            case 'update':
                await this.userRepository.updateUser(dataObj.data)
                break;
        }
    }
}