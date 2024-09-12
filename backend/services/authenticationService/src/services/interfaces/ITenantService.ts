export default interface ITenantService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleTenantEvents(dataObj: any): Promise<void>
}