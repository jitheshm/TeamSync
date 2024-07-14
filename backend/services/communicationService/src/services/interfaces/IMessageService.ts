import IMessage from "../../entities/MessageEntity";

export interface IMessageService {
    createMessage(dbId: string, data: IMessage): Promise<void>;
}