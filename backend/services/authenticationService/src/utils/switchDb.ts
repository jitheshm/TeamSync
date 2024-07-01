import { Connection, Document, Model, Schema } from "mongoose";
import { dbInstance } from "../config/db/connect";
import UsersSchema from "../schemas/userSchema";
import { IUsers } from "../entities/UserEntity";
import OtpSchema from "../schemas/otpSchema";
import AdminSchema from "../schemas/adminSchema";
import TenantsSchema from "../schemas/tenantSchema";

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
            default:
                throw new Error('Model not found');
        }
    } else {
        throw new Error('Database not found');
    }

    // Use the dbInstance to get the specific database connection
    const db = dbInstance.connection.useDb(dbname, { useCache: true });

    // Return the model
    return db.model<T & Document>(modelName, schema);
}
