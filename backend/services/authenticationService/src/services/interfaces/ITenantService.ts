export interface ITenantService {
    handleTenantEvent(eventType: string, data: any): Promise<void>;
}
