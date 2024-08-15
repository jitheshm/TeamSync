import { ITenantUsers } from "../../entities/TenantUserEntity";
import { IUsers } from "../../entities/UserEntity";
import jwt from 'jsonwebtoken';

export interface IMiddlewareService {
    userApiAuth(token: string): Promise<{
        userObj: IUsers;
        decode: jwt.JwtPayload;
    } | {
        userObj: ITenantUsers;
        decode: jwt.JwtPayload;
    }>
    tenantAuth(decode: any, body: any, params: any): Promise<void>

}