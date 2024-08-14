import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interface/IUserRepository";
import { injectable } from "inversify";
import { CustomError } from "teamsync-common";

@injectable()
export default class UserRepository implements IUserRepository {

    async create(user: Partial<IUsers>): Promise<IUsers & Document> {
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

    async verifyUser(email: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const resObj = await userModel.findOneAndUpdate({ email: email }, { is_verified: true }, { new: true })
            if (!resObj) {
                throw new CustomError('User not found', 404)
            }
            return resObj

        } catch (error) {
            console.log('Error in UserRepository verifyUser method');

            console.log(error);

            throw error
        }
    }

    async fetchUser(email: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const userdata = await userModel.aggregate([
                {
                    $match: { email: email }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "tenant"

                    }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "tenants[0]._id",
                        foreignField: "tenant_id",
                        as: "subscription"

                    }
                }
            ]).exec()
            return userdata[0]
        } catch (error) {
            console.log('Error in UserRepository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async fetchUserByAuthId(authentication_id: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const userdata = await userModel.aggregate([
                {
                    $match: { authentication_id: authentication_id }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "tenant"

                    }
                }
            ]).exec()
            
            return userdata[0]

        } catch (error) {
            console.log('Error in UserRepository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async updateUser(data: Partial<IUsers & Document>): Promise<IUsers & Document | null> {
        try {
            const userModel = switchDb(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOneAndUpdate({ email: data.email }, data, { new: true })
        } catch (error) {
            console.log('Error in UserRepository updateUser method');

            throw error
        }
    }



}