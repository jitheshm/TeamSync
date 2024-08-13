import { Document } from "mongoose";
import { IFetchReturn } from "../../repository/interface/IUserRepository";
import { DecodedIdToken } from "firebase-admin/auth";

export interface IUserService {
    firebaseLogin(token: string): Promise<{ accessToken: string, refreshToken: string, decodedToken: DecodedIdToken, userExist: IFetchReturn & Document }>;
    forgetPassword(email: string): Promise<void>
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userData: IFetchReturn & Document;
    }>
}