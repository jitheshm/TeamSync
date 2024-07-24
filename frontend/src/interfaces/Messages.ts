
export default interface IMessage {
    _id: string;
    message: string;
    sender: string;
    sender_name: string;
    group_id: string
    timestamp: Date;
    is_deleted: boolean;
}