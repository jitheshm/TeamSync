import mongoose from "mongoose";

export default interface ITenantUserService {
    tenantLogin(email: string, tenantId: string): Promise<{ token: string; name: string; tenantId: string; role: string; id: mongoose.Schema.Types.ObjectId } | null>
    sendOtpAndVerifyTenantUser(email: string, tenantId: string, context: string): Promise<void>
    handleTenantUserEvent(eventType: string, data: any, dbName?: string): Promise<void>;
}