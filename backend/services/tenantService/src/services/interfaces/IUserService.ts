export interface IUserService {
    handleKafkaEvent(dataObj: any): Promise<void>
}