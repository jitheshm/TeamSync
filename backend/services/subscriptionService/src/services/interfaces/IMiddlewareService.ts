import { IUsers } from "../../entities/UserEntity";
import jwt from 'jsonwebtoken';

export interface IMiddlewareService {
    userApiAuth(token: string): Promise<{
        userObj: IUsers;
        decode: jwt.JwtPayload;
    }>
    adminApiAuth(token: string): Promise<string | jwt.JwtPayload>

}