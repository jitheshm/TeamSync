import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<void>
    updateUser(data: IUsers & Document): Promise<void>
    fetchUser(email: string): Promise<IUsers & Document | null>

}