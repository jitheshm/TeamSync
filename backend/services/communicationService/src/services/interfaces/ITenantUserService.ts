
export interface ITenantUserService {
    handleEvent(eventType: string, data: any, dbName: string): Promise<void>;
    
}
