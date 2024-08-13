import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import { IAdminService } from "../interfaces/IAdminService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAdminAccessToken, generateAdminRefreshToken } from "../../utils/adminToken";
import { generateAccessToken } from "../../utils/token";
import { UnauthorizedError } from "../../errors/Unauthorized";

const REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET as string;

@injectable()
export default class AdminService implements IAdminService {
    private adminRepository: IAdminRepository;

    constructor(@inject("IAdminRepository") adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async login(user_name: string, password: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const adminObj = await this.adminRepository.fetchUser(user_name)
        if (!adminObj) {
            throw new InvalidCredentialsError()
        }
        const resObj = await bcrypt.compare(password, adminObj.password)
        if (!resObj) {
            throw new InvalidCredentialsError()
        }

        const accessToken = generateAdminAccessToken({ name: 'admin' })
        const refreshToken = generateAdminRefreshToken({ name: 'admin' })

        return { accessToken, refreshToken }

    }

    newToken(refreshToken: string) {
        try {
            const payload: jwt.JwtPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
            const data = { name: payload.name }
            const newAccessToken = generateAccessToken(data);
            return newAccessToken
        } catch (error) {
            console.log(error);
            throw new UnauthorizedError()
        }

    }
}