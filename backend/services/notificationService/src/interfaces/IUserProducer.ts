import { IUsers } from "../entities/UserEntity";

export default interface IUserProducer{
    sendMessage(eventType: string,user?: IUsers): Promise<void>
}