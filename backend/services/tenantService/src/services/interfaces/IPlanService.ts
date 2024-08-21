export interface IPlanService {
    handleKafkaEvent(dataObj: any): Promise<void>
}