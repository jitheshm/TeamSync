import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<void>
    verifyUser(email: string): Promise<IUsers & Document>
    fetchUser(email: string): Promise<IUsers & Document | null>
}