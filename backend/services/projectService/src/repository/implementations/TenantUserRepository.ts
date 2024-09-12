
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

    async fetchTenantUsers(dbId: string, role: string | null) {
        try {
            console.log(dbId);

            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            let data = null
            if (role) {
                data = await TenantUserModel.aggregate([
                    {
                        $match: {
                            role: role,
                            is_deleted: false
                        }

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
                    }
                ]).exec()
            }
            else {
                data = await TenantUserModel.aggregate([
                    {
                        $match: {
                            is_deleted: false
                        }

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
                    }
                ]).exec()
            }
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Tenant User  Repository fetchUser method');

            console.log(error);

            throw error
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

    async fetchAvailableTenantUsers(dbId: string, branchId: mongoose.Types.ObjectId, role: string) {
        try {
            const TenantUserModel = switchDb<ITenantUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users');
            let data = null;

            const matchStage: any = {
                is_deleted: false,
                branch_id: branchId,
                role: role
            };


            const aggregationPipeline: any[] = [
                {
                    $match: matchStage
                }
            ];

            if (role === 'Project_Manager') {
                aggregationPipeline.push(
                    {
                        $lookup: {
                            from: 'projects',
                            let: { userId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$project_manager_id', '$$userId'] },
                                        stage: { $ne: 'completed' } 
                                    }
                                }
                            ],
                            as: 'project_manager_projects'
                        }
                    },
                    {
                        $addFields: {
                            project_manager_project_count: { $size: '$project_manager_projects' }
                        }
                    },
                    {
                        $match: {
                            project_manager_project_count: { $lt: 3 }
                        }
                    }
                );
            }
            if (role === 'Developer') {
                aggregationPipeline.push(
                    {
                        $lookup: {
                            from: 'projects',
                            let: { userId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr:  { $in: ['$$userId', '$developers_id'] } 
                                    }
                                },
                                {
                                    $match: {
                                        stage: { $ne: 'completed | testing' } 
                                    }
                                }
                            ],
                            as: 'developer_projects'
                        }
                    }, {
                        $match: {
                            developer_projects: { $eq: [] }
                        }
                    }
                );
            }

            if (role === 'Tester') {
                aggregationPipeline.push(
                    {
                        $lookup: {
                            from: 'projects',
                            let: { userId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr:  { $in: ['$$userId', '$testers_id'] } 
                                    }
                                },
                                {
                                    $match: {
                                        stage: { $ne: 'completed' } 
                                    }
                                }
                            ],
                            as: 'tester_projects'
                        }
                    }, {
                        $match: {
                            tester_projects: { $eq: [] }
                        }
                    }
                );
            }

            data = await TenantUserModel.aggregate(aggregationPipeline).exec();

            return data;
        } catch (error) {
            console.log('Error in Tenant User Repository fetchUser method');
            console.log(error);
            throw error;
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

