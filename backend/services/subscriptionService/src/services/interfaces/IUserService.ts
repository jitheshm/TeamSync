export interface IUserService{
    handleKafkaEvent(eventType: string, data: any): Promise<void>
}