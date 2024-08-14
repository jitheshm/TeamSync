export default interface IBranchService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleBranchEvents(dataObj: any): Promise<void>
}