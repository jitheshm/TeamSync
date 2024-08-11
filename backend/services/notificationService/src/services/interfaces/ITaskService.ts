
export interface ITaskService {
    handleCreateTaskEvent(dataObj: any): Promise<void>;
    
}
