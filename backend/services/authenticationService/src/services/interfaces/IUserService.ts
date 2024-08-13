import { Document } from "mongoose";
import { IFetchReturn } from "../../repository/interface/IUserRepository";
import { DecodedIdToken } from "firebase-admin/auth";

export interface IUserService {
    firebaseLogin(token: string): Promise<{ accessToken: string, refreshToken: string,decodedToken:DecodedIdToken,userExist: IFetchReturn & Document}>;
}