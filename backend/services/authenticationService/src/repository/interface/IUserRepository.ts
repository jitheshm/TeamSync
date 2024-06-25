import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: Partial<IUsers>): Promise<IUsers & Document>
    verifyUser(email: string): Promise<IUsers & Document>
    fetchUser(email: string): Promise<IUsers & Document | null>
    fetchUserByAuthId(authentication_id: string): Promise<IUsers & Document | null>
    updateUser(data: Partial<IUsers & Document>): Promise<IUsers & Document | null>
}