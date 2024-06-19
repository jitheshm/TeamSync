export default interface IProducer<T> {
    sendMessage(eventType: string, data: T): Promise<void>
}