
import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserService {
    createUser(data: IUsers): Promise<void>;
    updateUser(data: IUsers & Document): Promise<void>;
    handleKafkaEvent(eventType: string, data: any): Promise<void>;
}
