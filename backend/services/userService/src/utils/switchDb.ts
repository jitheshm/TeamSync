import { Connection, Document, Model, Models, Schema } from "mongoose"
import { dbInstance } from "../config/db/connect"
import UsersSchema from "../schemas/userSchema";
import TenantsSchema from "../schemas/tenantSchema";
import BranchesSchema from "../schemas/branchSchema";
import TenantUserSchema from "../schemas/tenantUserSchema";

export default function <T>(dbname: string, modelName: string): Model<T & Document> {
    let schema: Schema;

    if (dbname === `${process.env.SERVICE}_main`) {
        switch (modelName) {
            case 'users':
                schema = UsersSchema
                break;
            case 'tenants':
                schema = TenantsSchema;
                break;
            default:
                throw new Error('Model not found')

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

    const db = dbInstance.connection.useDb(dbname, { useCache: true })
    return db.model<T & Document>(modelName, schema);


}