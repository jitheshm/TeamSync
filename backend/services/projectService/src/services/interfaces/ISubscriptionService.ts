export interface ISubscriptionService{
    handleKafkaEvent(eventType: string, data: any): Promise<void>
}