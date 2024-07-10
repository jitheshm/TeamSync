import jwt, { JwtPayload } from 'jsonwebtoken';
import UserRepository from "../repository/implementations/UserRepository";
import { IUserRepository } from "../repository/interfaces/IUserRepository";
import { Socket } from "socket.io";

const userRepository: IUserRepository = new UserRepository();

export default async (socket: Socket, next: (err?: Error) => void) => {
    try {
        console.log(socket.handshake.auth.token)
        
        const token = socket.handshake.auth.token;

        if (token) {
            if (!process.env.JWT_SECRET_KEY)
                throw new Error('JWT_SECRET_KEY not found in .env file');

            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

            console.log(decode);

            if (decode.role === 'Tenant_Admin') {
                const userObj = await userRepository.fetchUserByEmail(decode.email);
                if (!userObj || userObj.is_blocked || userObj.is_deleted || !userObj.is_verified) {
                    return next(new Error("unauthorised"));
                }

                socket.data.user = decode;
                next();
            } else if (decode) {
                const userObj = await userRepository.fetchTenantUserByEmail(decode.email, decode.tenantId);
                console.log(userObj, "jjjjj");

                if (!userObj || userObj.is_deleted) {
                    return next(new Error("unauthorised"));
                }

                socket.data.user = decode;
                next();
            } else {
                return next(new Error("unauthorised"));
            }
        } else {
            return next(new Error("unauthorised"));
        }
    } catch (error: any) {
        console.log(error);
        if (error.message === 'jwt expired' || error.message === 'jwt malformed' || error.message === 'invalid signature') {
            return next(new Error("Token expired or Invalid"));
        }

        next(new Error("An unexpected error occurred. Please try again later."));
    }
};
