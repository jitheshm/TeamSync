

export default interface IProducer<T>{
    sendMessage(eventType: string,user?: T): Promise<void>
}