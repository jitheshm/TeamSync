import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<void>
    fetchUserByEmail(email: string): Promise<IUsers | null>
}