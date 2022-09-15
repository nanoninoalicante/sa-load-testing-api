import { User } from '../mongoose/connect';

export const createUser = async (data: any) => {
    const user = new User(data);
    return await user.save();
}

export const updateUser = async (data: any) => {
    return await User.updateOne(data);
}