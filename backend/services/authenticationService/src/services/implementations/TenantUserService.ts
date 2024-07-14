import jwt from 'jsonwebtoken';
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import mongoose from 'mongoose';
import { sendOtp } from '../../utils/otp';
import ITenantUserService from '../interfaces/ITenantUserService';

export default class TenantUserService implements ITenantUserService {
    private tenantUserRepository: ITenantUserRepository;

    constructor({ tenantUserRepository }: { tenantUserRepository: ITenantUserRepository }) {
        this.tenantUserRepository = tenantUserRepository;
    }

    async tenantLogin(email: string, tenantId: string): Promise<{ token: string; name: string; tenantId: string; role: string; id: mongoose.Schema.Types.ObjectId } | null> {
        try {
            const userObj = await this.tenantUserRepository.fetchSpecificUser(tenantId, email);

            if (!userObj) {
                return null;
            }

            const token = jwt.sign({
                email: email,
                name: userObj.name,
                id: userObj._id,
                tenantId: tenantId,
                role: userObj.role,
                branchId: userObj.branch_id
            }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

            return { token, name: userObj.name as string, tenantId: tenantId, role: userObj.role as string, id: userObj._id };
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async sendOtpAndVerifyTenantUser(email: string, tenantId: string, context: string): Promise<void> {
        try {
            const userData = await this.tenantUserRepository.fetchSpecificUser(tenantId, email);

            if (!userData) {
                throw { status: 401, message: "Invalid email address" };
            }

            sendOtp(email, context);
        } catch (error) {
            throw error;
        }
    }

    async handleTenantUserEvent(eventType: string, data: any, dbName?: string): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.tenantUserRepository.create(data, dbName!);
                break;
            case 'update':
                await this.tenantUserRepository.update(data, dbName!, data._id);
                break;
           
            default:
                throw new Error(`Unknown event type: ${eventType}`);
        }
    }
}
