
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../interfaces/ITenantRepository";




export default class TenantRepository implements ITenantRepository {

    async create(data: ITenants) {
        try {
            const TenantModel = switchDb<ITenants>(`${process.env.SERVICE}_main`, 'tenants')
            const newTenant = new TenantModel(data)
            await newTenant.save()
            return newTenant._id
        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }


}