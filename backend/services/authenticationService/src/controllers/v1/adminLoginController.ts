import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AdminRepository from '../../repository/implementations/adminRepository';
import { IAdminService } from '../../services/interfaces/IAdminService';
import AdminService from '../../services/implementations/AdminService';
import { IAdminRepository } from '../../repository/interface/IAdminRepository';

const adminRepository:IAdminRepository = new AdminRepository();
const adminService: IAdminService = new AdminService(adminRepository);

export default async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_name, password }: { user_name: string; password: string } = req.body;
        console.log('user_name:', user_name);
        console.log('password', password);
        


        const token = await adminService.authenticateAdmin(user_name, password);

        if (!token) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Admin verified', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};
