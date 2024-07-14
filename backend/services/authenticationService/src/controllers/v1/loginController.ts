
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../repository/interface/IUserRepository';
import UserRepository from '../../repository/implementations/UserRepository';
import { UserService } from '../../services/implementations/UserService';

const userRepository: IUserRepository = new UserRepository();
const userService = new UserService(userRepository);

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password }: { email: string; password: string } = req.body;
        const userData = await userService.authenticateUser(email, password);

        if (!userData) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (userData.is_blocked) {
            return res.status(403).json({ error: 'User is blocked' });
        }

        if (!userData.is_verified) {
            return res.status(200).json({ message: 'User not verified', verified: false });
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
        }

        const token = jwt.sign(
            {
                email: userData.email,
                name: userData.first_name,
                id: userData._id,
                tenantId: userData?.tenant?.[0]?._id,
                role: 'Tenant_Admin',
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'User verified',
            verified: true,
            token: token,
            name: userData.first_name,
            tenantId: userData?.tenant?.[0]?._id,
            role: 'Tenant_Admin',
            id: userData._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};
