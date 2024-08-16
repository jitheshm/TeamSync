import { inject, injectable } from "inversify";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError, NotFound, UnauthorizedError } from "teamsync-common";
import { IMiddlewareService } from "../interfaces/IMiddlewareService";


@injectable()
export class MiddlewareServices implements IMiddlewareService {
    private userRepository: IUserRepository;


    constructor(
        @inject("IUserRepository") userRepository: IUserRepository,

    ) {
        this.userRepository = userRepository;

    }


    async userApiAuth(token: string) {
        if (!process.env.JWT_SECRET_KEY)
            throw new Error('JWT_SECRET_KEY not found in .env file');

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

        console.log(decode);


        if (decode) {
            const userObj = await this.userRepository.fetchUser(decode.email)
            if (!userObj || userObj.is_blocked || userObj.is_deleted || !userObj.is_verified) {
                throw new UnauthorizedError()
            }

            return { userObj, decode }
        }
        else {
            throw new UnauthorizedError()
        }
    }

    async adminApiAuth(token: string) {
        if (!process.env.JWT_ADMIN_SECRET_KEY)
            throw new Error('JWT_Admin_SECRET_KEY not found in .env file');

        const decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);

        console.log(decode);
        if (decode) {
            return decode
        } else {
            throw new UnauthorizedError()
        }
    }


}