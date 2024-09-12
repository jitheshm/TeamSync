export default interface ISubscriptionService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubscriptionEvents(dataObj: any): Promise<void>
}