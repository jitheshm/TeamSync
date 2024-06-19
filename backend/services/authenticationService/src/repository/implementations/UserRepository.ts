import { IUsers } from "../../entities/UserEntity";
import CustomError from "../../utils/CustomError";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interface/IUserRepository";

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

    async verifyUser(email: string) {
        try {
            const userModel = switchDb<IUsers>(`${process.env.SERVICE}_main`, 'users')
            const resObj=await userModel.updateOne({ email: email }, { is_verified: true })
            if(resObj.modifiedCount==0){
                throw new CustomError('User not found', 404)
            }
            return
            
        } catch (error) {
            console.log('Error in UserRepository verifyUser method');

            console.log(error);

            throw error
        }
    }

}