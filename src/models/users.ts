import mongoose from 'mongoose';
// import { mainConnection } from '../mongoose/connection';
// import { connectNames } from '../mongoose/connection-v2';
import { User } from "../mongoose/connection-v2"
export const usersSchema = new mongoose.Schema({
    name: String,
    updatedAt: String
});
export const createUser = async (data: any) => {
    const user = new User(data);
    return await user.save();
}

export const updateUser = async (data: any) => {
    return await User.updateOne(data);
}

export const saveUser = async (data: any) => {
    const user = await User.findOne()
    user.updatedAt = data.updatedAt;
    return await user.save();
}