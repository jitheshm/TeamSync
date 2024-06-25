import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interfaces/IUserRepository";

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
            const userModel = switchDb(`${process.env.SERVICE}_main`, 'users')
            await userModel.updateOne({ email: data.email }, data)
            return
        } catch (error) {
            console.log('Error in UserRepository updateUser method');

            throw error
        }
    }

    async fetchUser(id: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            return await userModel.findById(id)
        } catch (error) {
            console.log('Error in UserRepository fetchUser method');

            console.log(error);

            throw error
        }
    }



}