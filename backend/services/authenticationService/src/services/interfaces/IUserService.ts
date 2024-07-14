import mongoose from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserService {
    verifyUserToken(token: string): Promise<any | null>;
    createUserFromFirebase(decodedToken: any): Promise<any>;
    authenticateUser(email: string, password: string): Promise<any>;
    signup(email: string): Promise<{ token: string; name: string; id: mongoose.Schema.Types.ObjectId } | null>
    forgotPassword(email: string): Promise<string>
    sendOtpAndVerifyUser(email: string, context: string): Promise<void>
    updateUserPassword(email: string, newPassword: string): Promise<IUsers | null>
    
}
