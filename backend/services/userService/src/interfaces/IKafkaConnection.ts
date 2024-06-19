import { Consumer, Producer } from 'kafkajs';

export interface IKafkaConnection {
    getProducerInstance(): Promise<Producer>;
    getConsumerInstance(groupId:string): Promise<Consumer>;
}
