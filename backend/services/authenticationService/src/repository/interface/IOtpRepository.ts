import { Document } from "mongoose";
import { IOtp } from "../../entities/OtpEntity";


export interface IOtpRepository {
    create(otp: IOtp,email:string): Promise<void>,
    fetchOtp(email: string): Promise<IOtp & Document | null>
}