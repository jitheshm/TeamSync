import mongoose, { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interface/IUserRepository";
import { UpdateWriteOpResult } from 'mongoose';

export default class UserRepository implements IUserRepository {

    async create(user: IUsers) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const newUser = new userModel(user)
            await newUser.save()
            return newUser
        } catch (error) {
            console.log('Error in UserRepository create method');

            console.log(error);

            throw error
        }
    }

    async fetchUserByEmail(email: string): Promise<IUsers | null> {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUserByEmail method');

            throw error
        }
    }

    async updateUser(data: IUsers & Document): Promise<void> {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            await userModel.updateOne({ email: data.email }, data)
            return
        } catch (error) {
            console.log('Error in UserRepository updateUser method');

            throw error
        }
    }

    async fetchAllUsers(name: string, page: number, limit: number) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            let data = null;

            const matchStage: any = {
                is_deleted: false
            };


            if (name) {
                matchStage.first_name = { $regex: `^${name}`, $options: 'i' };
            }

            const aggregationPipeline = [
                {
                    $match: matchStage
                },

                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ];

            data = await userModel.aggregate(aggregationPipeline).exec();

            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];

            const totalCountResult = await userModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

            return { data, total };

        } catch (error: any) {
            console.log('Error in UserRepository fetchAllUsers method');
            throw error
        }
    }

    async updateUserById(data: Partial<IUsers & Document>): Promise<IUsers | null> {
        try {


            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOneAndUpdate({ _id: data._id }, data, { new: true })

        } catch (error) {
            console.log('Error in UserRepository updateUser method');

            throw error
        }
    }

    async deleteUserById(userId: mongoose.Types.ObjectId): Promise<IUsers | null> {
        try {

            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOneAndUpdate({ _id: userId }, { is_deleted: true }, { new: true })

        } catch (error) {
            console.log('Error in UserRepository updateUser method');

            throw error
        }
    }
    async fetchSpecificUser(userId: mongoose.Types.ObjectId): Promise<IUsers | null> {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOne({ _id: userId }, { password: 0 })
        } catch (error: any) {
            console.log('Error in UserRepository fetchAllUsers method');
            throw error
        }
    }

    async fetchTenantUserByEmail(email: string, dbId: string): Promise<IUsers | null> {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUserByEmail method');

            throw error
        }
    }

}
