import { IUsers } from "../../entities/UserEntity";
import switchDb from "../../utils/switchDb";
import { IUserRepository } from "../interface/IUserRepository";

export default class UserRepository implements IUserRepository {

    async create(user: IUsers) {
        try {
            const userModel = switchDb('TeamSync', 'users')
            const newUser = new userModel(user)
            await newUser.save()
            return
        } catch (error) {
            console.log('Error in UserRepository create method');

            console.log(error);

            throw error
        }
    }

    async fetchUserByEmail(email: string): Promise<IUsers | null> {
        try {
            const userModel = switchDb('TeamSync', 'users')
            return await userModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in UserRepository fetchUserByEmail method');

            throw error
        }
    }
}