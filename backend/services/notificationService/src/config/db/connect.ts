import mongoose from "mongoose";
export let dbInstance: typeof mongoose;

export default async () => {
    try {
        console.log("db connection started");  
        if (process.env.MONGODB_URL) {
            
            
            dbInstance = await mongoose.connect(process.env.MONGODB_URL)
            // console.log(dbInstance);
            
            console.log("db connection ready for use");

        } else {
            throw new Error("MONGODB_URL not defined")
        }

    } catch (err) {
        console.log("db connection connection failed" + err);
    }
}