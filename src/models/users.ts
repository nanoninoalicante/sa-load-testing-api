import mongoose from 'mongoose';
import { mainConnection } from '../mongoose/connection';
const usersSchema = new mongoose.Schema({
    name: String,
    updatedAt: String
});
const User = mainConnection.model('User', usersSchema);
export const createUser = async (data: any) => {
    const user = new User(data);
    return await user.save();
}

export const updateUser = async (data: any) => {
    return await User.updateOne(data);
}