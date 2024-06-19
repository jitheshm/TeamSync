import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<IUsers>
    fetchUserByEmail(email: string): Promise<IUsers | null>
}