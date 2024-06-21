import { Connection, Document, Model, Schema } from "mongoose";
import { dbInstance } from "../config/db/connect";
import planSchema from "../schemas/planSchema";




// Define a generic function type
export default function getModel<T>(dbname: string, modelName: string): Model<T & Document> {
    let schema: Schema;

    if (dbname === `${process.env.SERVICE}_main`) {
        switch (modelName) {
            case 'plans':
                schema = planSchema;
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
