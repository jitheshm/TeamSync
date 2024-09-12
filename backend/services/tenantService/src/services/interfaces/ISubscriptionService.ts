export interface ISubscriptionService{
    handleKafkaEvent(dataObj: any): Promise<void>
}