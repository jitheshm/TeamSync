
export interface ITicketService {
    handleCreateTicketEvent(dataObj: any): Promise<void>;
    
}
