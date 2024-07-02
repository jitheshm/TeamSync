import mongoose, { Types } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../interface/ITenantRepository";

export default class TenantRepository implements ITenantRepository {
    async create(data: ITenants): Promise<mongoose.Schema.Types.ObjectId> {
        try {
            const TenantModel = switchDb<ITenants>(`${process.env.SERVICE}_main`, 'tenants');
            const newTenant = new TenantModel(data);
            await newTenant.save();
            return newTenant._id
        } catch (error) {
            console.log('Error in TenantRepository create method');
            console.log(error);
            throw error;
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

}


