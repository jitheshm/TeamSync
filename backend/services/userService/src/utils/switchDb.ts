import { Connection, Document, Model, Models, Schema } from "mongoose"
import { dbInstance } from "../config/db/connect"
import UsersSchema from "../schemas/userSchema";
import { IUsers } from "../entities/UserEntity";
import TenantsSchema from "../schemas/tenantSchema";

export default (dbname: string, modelName: string): Model<IUsers & Document> => {
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
        throw new Error('Database not found')

    }

    const db = dbInstance.connection.useDb(dbname, { useCache: true })
    return db.model<IUsers & Document>(modelName, schema);


}