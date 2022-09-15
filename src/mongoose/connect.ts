import mongoose from 'mongoose';
import { config } from "dotenv";
config();
const MONGODB_HOST = process.env.MONGODB_HOST;
export let connection: any = null;
export const main = async () => {
    try {
        connection = mongoose.createConnection(MONGODB_HOST, {
            serverSelectionTimeoutMS: 2000
        })
        await connection.asPromise();
        console.log("connected");
    } catch (error) {
        connection = null;
        console.log("error from mongoose: ", error.message);
        throw error;
    }
}