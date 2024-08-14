import { inject, injectable } from "inversify";
import { IBranchRepository } from "../../repository/interface/IBranchRepository";
import IBranchService from "../interfaces/IBranchService";

@injectable()
export default class BranchService implements IBranchService {
    private branchRepository: IBranchRepository;

    constructor(
        @inject("IBranchRepository") branchRepository: IBranchRepository
    ) {
        this.branchRepository = branchRepository;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleBranchEvents(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':
                await this.branchRepository.create(dataObj.data, dataObj.dbName)
                break;
            case 'update':
                await this.branchRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                break;
        }
    }
}