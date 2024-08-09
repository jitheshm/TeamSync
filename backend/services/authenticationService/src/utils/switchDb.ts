import { Connection, Document, Model, Schema } from "mongoose";
import { dbInstance } from "../config/db/connect";
import UsersSchema from "../schemas/userSchema";
import OtpSchema from "../schemas/otpSchema";
import AdminSchema from "../schemas/adminSchema";
import TenantsSchema from "../schemas/tenantSchema";
import TenantUserSchema from "../schemas/tenantUserSchema";
import BranchesSchema from "../schemas/branchSchema";
import SubscriptionSchema from "../schemas/subscriptionSchema";

// Define a generic function type
export default function getModel<T>(dbname: string, modelName: string): Model<T & Document> {
    let schema: Schema;

    if (dbname === `${process.env.SERVICE}_main`) {
        switch (modelName) {
            case 'users':
                schema = UsersSchema;
                break;
            case 'otps':
                schema = OtpSchema;
                break;
            case 'admins':
                schema = AdminSchema;
                break;
            case 'tenants':
                schema = TenantsSchema;
                break;
            case 'subscriptions':
                schema = SubscriptionSchema;
                break;
            default:
                throw new Error('Model not found');
        }
    } else {
        switch (modelName) {
            case 'branches':
                schema = BranchesSchema;
                break;
            case 'tenant_users':
                schema = TenantUserSchema;
                break;
            default:
                throw new Error('Model not found');
        }
    }

    if (!schema) {
        throw new Error('Schema not assigned');
    }
    // Use the dbInstance to get the specific database connection
    const db = dbInstance.connection.useDb(dbname, { useCache: true });

    // Return the model
    return db.model<T & Document>(modelName, schema);
}
