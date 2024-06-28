import mongoose, { Document, UpdateWriteOpResult } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<IUsers>
    fetchUserByEmail(email: string): Promise<IUsers | null>
    updateUser(data: IUsers & Document): Promise<void>
    fetchAllUsers(): Promise<IUsers[]>
    updateUserById(data: Partial<IUsers & Document>): Promise<IUsers | null>
    deleteUserById(userId: mongoose.Types.ObjectId): Promise<IUsers | null>
}