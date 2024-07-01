import mongoose, { Types } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../interface/ITenantRepository";

export default class TenantRepository implements ITenantRepository {
    async create(data: ITenants): Promise<Types.ObjectId> {
        try {
            const TenantModel = switchDb(`${process.env.SERVICE}_main`, 'tenants');
            const newTenant = new TenantModel(data);
            await newTenant.save();
            return newTenant._id as Types.ObjectId; // Explicitly cast to Types.ObjectId
        } catch (error) {
            console.log('Error in TenantRepository create method');
            console.log(error);
            throw error;
        }
    }
}
