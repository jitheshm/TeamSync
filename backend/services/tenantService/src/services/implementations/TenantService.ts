import { inject, injectable } from "inversify";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { ITenantService } from "../interfaces/ITenantService";
import { CustomError, IKafkaConnection, IProducer } from "teamsync-common";
import { ITenants } from "../../entities/TenantEntity";
import { Producer } from "kafkajs";

@injectable()
export class TenantService implements ITenantService {
    private tenantRepository: ITenantRepository
    private kafkaConnection: IKafkaConnection
    private createTenantProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<ITenants>>;


    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITenantProducer") createTenantProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<ITenants>>

    ) {
        this.tenantRepository = tenantRepository
        this.kafkaConnection = kafkaConnection
        this.createTenantProducer = createTenantProducer
    }

    async createTenant(bodyObj: Partial<ITenants>) {
        const existTenant = await this.tenantRepository.getTenantByName(bodyObj.company_name as string)
        if (existTenant) {
            throw new CustomError("Tenant already exist with this name", 409)
        }
        bodyObj.tenant_id = '#tenant' + new Date().getTime() + Math.floor(Math.random() * 1000)
        const tenant = await this.tenantRepository.create(bodyObj);
        let producer = await this.kafkaConnection.getProducerInstance()
        let tenantProducer = this.createTenantProducer(producer, 'main', 'tenants')
        tenantProducer.sendMessage('create', tenant)
        return tenant
    }
}