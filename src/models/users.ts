import mongoose, {ObjectId} from 'mongoose';
// import { mainConnection } from '../mongoose/connection';
// import { connectNames } from '../mongoose/connection-v2';
import { User } from "../mongoose/connection-v2"
export const usersSchema = new mongoose.Schema({
    name: String,
    updatedAt: String,
    items: Array
});
export const createUser = async (data: any) => {
    const user = new User(data);
    return await user.save();
}

export const updateUser = async (data: any) => {
    return await User.updateOne(data);
}

export const saveUser = async (data: any) => {
    const user = await User.findOne({_id: data._id})
    const user2 = await User.findOne({_id: data._id})
    user.items = ["test", "new", new Date().valueOf()];
    await user.save();
    user2.updatedAt = "new";
    await user2.save();
}