
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import { ITenantUserRepository } from "../interface/ITenantUserRepository";




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
    async fetchTenantUsers(dbId: string, role: string | null) {
        try {
            console.log(dbId);

            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            let data = null
            if (role) {
                data = await TenantUserModel.find({ role: role, is_deleted: false })
            }
            else {
                data = await TenantUserModel.find({ is_deleted: false })
            }
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Tenant User  Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async fetchSpecificUser(dbId: string, email: string) {
        try {
            console.log(dbId);

            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            const data = await TenantUserModel.findOne({ email: email, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Tenant User  Repository fetchUser method');

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

    async delete(data: Partial<ITenantUsers>, dbId: string, userId: mongoose.Types.ObjectId) {
        try {
            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            const res: ITenantUsers | null = await TenantUserModel.findOneAndUpdate({ _id: userId, branch_id: data.branch_id, role: data.role }, { is_deleted: true }, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant user Repository create method');

            console.log(error);

            throw error
        }
    }


}