export interface ITenantService {
    handleKafkaEvent(eventType: string, data: any): Promise<void>
}