export interface IBranchService {
    handleBranchEvent(eventType: string, data: any, dbName: string): Promise<void>;
}
