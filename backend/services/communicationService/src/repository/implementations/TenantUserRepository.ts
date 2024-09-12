
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import { ITenantUserRepository } from "../interfaces/ITenantUserRepository";
import { injectable } from "inversify";



@injectable()

export default class TenantUserRepository implements ITenantUserRepository {

    async create(data: ITenantUsers, dbId: string) {
        try {
            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            const newTenantUser = new TenantUserModel(data)
            await newTenantUser.save()
            return newTenantUser
        } catch (error) {
            console.log('Error in Tenant User Repository create method');

            console.log(error);

            throw error
        }
    }





    async update(data: ITenantUsers, dbId: string, userId: mongoose.Types.ObjectId) {
        try {
            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            const res: ITenantUsers | null = await TenantUserModel.findOneAndUpdate({ _id: userId, branch_id: data.branch_id, is_deleted: false }, data, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant user Repository create method');

            console.log(error);

            throw error
        }
    }


    async fetchTenantUserByEmail(email: string, dbId: string): Promise<ITenantUsers | null> {
        try {
            console.log(email, dbId);

            const userModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUserByEmail method');

            throw error
        }
    }




}

