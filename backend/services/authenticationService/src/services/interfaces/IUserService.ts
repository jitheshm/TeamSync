import { Document } from "mongoose";
import { IFetchReturn } from "../../repository/interface/IUserRepository";
import { DecodedIdToken } from "firebase-admin/auth";
import mongoose from "mongoose";

export type VerifyOtpResponse =
    | {
        message: string;
        verified: boolean;
        token: string;
        name?: string;
        role?: string;
        id: mongoose.Schema.Types.ObjectId;
        accessToken?: never;
        refreshToken?: never;
        tenantId?: never;
    }
    | {
        message: string;
        verified: boolean;
        token?: never;
        name?: string;
        role?: string;
        id: mongoose.Schema.Types.ObjectId;
        accessToken?: string;
        refreshToken?: string;
        tenantId?: string;
    } |
    {
        message: string;
        token: string;
    }
    ;


export interface IUserService {
    firebaseLogin(token: string): Promise<{ accessToken: string, refreshToken: string, decodedToken: DecodedIdToken, userExist: IFetchReturn & Document }>;
    forgetPassword(email: string): Promise<void>
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userData: IFetchReturn & Document;
    }>
    newToken(refreshToken: string): Promise<string>
    verifyOtp({ email, otp, context, tenantId }: {
        email: string;
        otp: string;
        context: string;
        tenantId?: string;
    }): Promise<VerifyOtpResponse>
    resendOtp(email: string, context: string, tenantId?: string): Promise<void>
    resetPassword(email: string, newPassword: string): Promise<void>
    tenantLogin(email: string, role: string, tenantId: string): Promise<void>
}