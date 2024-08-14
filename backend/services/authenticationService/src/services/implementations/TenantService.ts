import { inject, injectable } from "inversify";
import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import ITenantService from "../interfaces/ITenantService";


@injectable()
export default class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository;

    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository
    ) {
        this.tenantRepository = tenantRepository;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleTenantEvents(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':
                await this.tenantRepository.create(dataObj.data)
                break;

        }
    }
}