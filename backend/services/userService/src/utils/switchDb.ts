import { Connection, Document, Model, Models, Schema } from "mongoose"
import { dbInstance } from "../config/db/connect"
import UsersSchema from "../schemas/userSchema";
import { IUsers } from "../entities/UserEntity";
import TenantsSchema from "../schemas/tenantSchema";
import BranchesSchema from "../schemas/branchSchema";

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