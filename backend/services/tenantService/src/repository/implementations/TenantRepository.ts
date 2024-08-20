
import mongoose, { ObjectId, Types } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../interfaces/ITenantRepository";
import { injectable } from "inversify";



@injectable()
export default class TenantRepository implements ITenantRepository {

    async create(data: ITenants) {
        try {
            const TenantModel = switchDb<ITenants>(`${process.env.SERVICE}_main`, 'tenants')
            const newTenant = new TenantModel(data)
            await newTenant.save()
            return newTenant
        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }
    async getTenantById(tenantId: Types.ObjectId): Promise<ITenants | null> {
        try {
            const TenantModel = switchDb<ITenants>(`${process.env.SERVICE}_main`, 'tenants');
            return await TenantModel.findOne({_id:tenantId,is_deleted:false})
        } catch (error) {
            console.log('Error in TenantRepository getTenantById method');
            console.log(error);
            throw error;
        }
    }

    async getTenantByName(tenantName:string): Promise<ITenants | null> {
        try {
            const TenantModel = switchDb<ITenants>(`${process.env.SERVICE}_main`, 'tenants');
            return await TenantModel.findOne({company_name:tenantName,is_deleted:false})
        } catch (error) {
            console.log('Error in TenantRepository getTenantById method');
            console.log(error);
            throw error;
        }
    }

}