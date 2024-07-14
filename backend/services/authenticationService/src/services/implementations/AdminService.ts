// src/services/AdminService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAdminService } from '../interfaces/IAdminService';
import { IAdminRepository } from '../../repository/interface/IAdminRepository';


class AdminService implements IAdminService {
    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    public async authenticateAdmin(username: string, password: string): Promise<string | null> {
        const admin = await this.adminRepository.fetchUser(username);
        console.log('admin:', admin);
        
        if (!admin) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        console.log('isPasswordValid:', isPasswordValid);
        
        if (!isPasswordValid) {
            return null;
        }

        if (!process.env.JWT_ADMIN_SECRET_KEY) {
            throw new Error('JWT secret key not set');
        }

        const token = jwt.sign({ role: 'admin' }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '1h' });
        return token;
    }
}

export default AdminService;
