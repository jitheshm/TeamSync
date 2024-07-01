import { Connection, Document, Model, Schema } from "mongoose";
import { dbInstance } from "../config/db/connect";
import UsersSchema from "../schemas/userSchema";
import TenantsSchema from "../schemas/tenantSchema";
import BranchesSchema from "../schemas/branchSchema";

// Define a generic function type
export default function getModel<T>(dbname: string, modelName: string): Model<T & Document> {
    let schema: Schema | null = null;

    if (dbname === `${process.env.SERVICE}_main`) {
        switch (modelName) {
            case 'tenants':
                schema = TenantsSchema;
                break;
            case 'users':
                schema = UsersSchema;
                break;
            default:
                throw new Error('Model not found');
        }
    } else {
        switch (modelName) {
            case 'branches':
                schema = BranchesSchema;
                break;
            default:
                throw new Error('Model not found');
        }
    }

    if (!schema) {
        throw new Error('Schema not assigned');
    }

    const db = dbInstance.connection.useDb(dbname, { useCache: true });

    // Return the model
    return db.model<T & Document>(modelName, schema);
}
