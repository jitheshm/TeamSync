
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

    async fetchTenantUsers(dbId: string, role: string | null, name: string | null, page: number, limit: number) {
        try {
            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users');
            let data = null;
    
            const matchStage: any = {
                is_deleted: false
            };
    
            if (role) {
                matchStage.role = role;
            }
    
            if (name) {
                matchStage.name = { $regex: `^${name}`, $options: 'i' };
            }
    
            // Aggregation pipeline to get paginated users
            const aggregationPipeline = [
                {
                    $match: matchStage
                },
                {
                    $lookup: {
                        from: 'branches',
                        localField: 'branch_id',
                        foreignField: '_id',
                        as: 'branch'
                    }
                },
                {
                    $unwind: '$branch'
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        tenant_user_id: 1,
                        created_at: 1,
                        email: 1,
                        role: 1,
                        branch_id: 1,
                        branch_location: '$branch.location',
                        phone_no: 1
                    }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ];
    
            // Execute aggregation pipeline to get paginated data
            data = await TenantUserModel.aggregate(aggregationPipeline).exec();
    
            // Aggregation pipeline to get total count
            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];
    
            // Execute aggregation pipeline to get total count
            const totalCountResult = await TenantUserModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    
            return { data, total };
        } catch (error) {
            console.log('Error in Tenant User Repository fetchUser method');
            console.log(error);
            throw error;
        }
    }
    
    


    async fetchTenantSpecificUser(dbId: string, userId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            const data = await TenantUserModel.findOne({ _id: userId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Tenant User  Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

}

