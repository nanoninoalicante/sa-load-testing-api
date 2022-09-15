import mongoose from 'mongoose';
import { config } from "dotenv";
config();
const MONGODB_HOST = process.env.MONGODB_HOST;
const usersSchema = new mongoose.Schema({
    name: String,
    updatedAt: String
});
export let User: any = null;
export let connection: any = null;

export const disconnect = async () => {
    if (!connection) return null;

    return await connection.disconnect();
}
export const main = async () => {
    try {
        if (!connection) {
            connection = mongoose.createConnection(MONGODB_HOST, {
                serverSelectionTimeoutMS: 2000,
                maxPoolSize: 1000,
                waitQueueTimeoutMS: 2000,
                connectTimeoutMS: 2000
            })
            await connection.asPromise();
            User = connection.model('User', usersSchema);
        }
        console.log("connected");
    } catch (error) {
        connection = null;
        console.log("error from mongoose: ", error.message);
        throw error;
    }
}