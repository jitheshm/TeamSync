import { IBranchRepository } from "../../repository/interface/IBranchRepository";


export default class BranchService {
    private branchRepository: IBranchRepository;

    constructor(branchRepository: IBranchRepository) {
        this.branchRepository = branchRepository;
    }

    async handleBranchEvent(eventType: string, data: any, dbName: string): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.branchRepository.create(data, dbName);
                break;
            case 'update':
                await this.branchRepository.update(data, dbName, data._id);
                break;
            // Add more cases for other event types as needed
            default:
                throw new Error(`Unknown event type: ${eventType}`);
        }
    }
}
