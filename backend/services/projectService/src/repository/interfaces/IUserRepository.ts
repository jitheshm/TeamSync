import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<void>
    updateUser(data: IUsers & Document): Promise<void>
    fetchUser(email: string): Promise<IUsers & Document | null>
    fetchTenantUserByEmail(email: string, dbId: string): Promise<IUsers | null>
    fetchUserByEmail(email: string): Promise<IUsers | null>


}