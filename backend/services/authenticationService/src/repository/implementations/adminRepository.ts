import { IAdmin } from "../../entities/AdminEntity";
import { InternalServerError } from "../../errors/InternalServerError";
import switchDb from "../../utils/switchDb";
import { IAdminRepository } from "../interface/IAdminRepository";


export default class AdminRepository implements IAdminRepository {

    async fetchUser(user_name: string) {
        try {
            const userModel = switchDb<IAdmin>(`${process.env.SERVICE}_main`, 'admins')
            return await userModel.findOne({ user_name: user_name })
        } catch (error) {
            console.log('Error in UserRepository fetchUser method');

            console.log(error);

            throw new InternalServerError()
        }
    }

}