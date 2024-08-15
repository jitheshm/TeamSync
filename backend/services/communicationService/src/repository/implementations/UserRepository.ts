import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interfaces/IUserRepository";
import { injectable } from "inversify";

@injectable()
export default class UserRepository implements IUserRepository {

    async create(user: IUsers) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const newUser = new userModel(user)
            await newUser.save()
            return
        } catch (error) {
            console.log('Error in UserRepository create method');

            console.log(error);

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

    async fetchUser(email: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async fetchTenantUserByEmail(email: string, dbId: string): Promise<IUsers | null> {
        try {
            console.log(email, dbId);
            
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_${dbId}`, 'tenant_users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUserByEmail method');

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



}