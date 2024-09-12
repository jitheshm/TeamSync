import { injectable } from "inversify";
import { IOtp } from "../../entities/OtpEntity";
import switchDb from "../../utils/switchDb";
import { IOtpRepository } from "../interface/IOtpRepository";

@injectable()
export default class OtpRepository implements IOtpRepository {

    async create(otpObj: IOtp, email: string) {
        try {
            const otpModel = switchDb<IOtp>(`${process.env.SERVICE}_main`, 'otps')
            await otpModel.findOneAndUpdate({ email: email }, otpObj, { upsert: true })

            return
        } catch (error) {
            console.log('Error in OtpRepository create method');

            console.log(error);

            throw error
        }
    }

    async fetchOtp(email: string) {
        try {
            const otpModel = switchDb<IOtp>(`${process.env.SERVICE}_main`, 'otps')
            return await otpModel.findOne({ email: email })
        } catch (error) {
            console.log('Error in OtpRepository fetchOtp method');

            console.log(error);

            throw error
        }
    }

}