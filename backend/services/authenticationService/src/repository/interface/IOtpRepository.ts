import { IOtp } from "../../entities/OtpEntity";


export interface IOtpRepository {
    create(otp: IOtp,email:string): Promise<void>
}