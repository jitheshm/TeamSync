
export interface IUserService {
    handleEvent(eventType: string, data: any): Promise< void>;
}
