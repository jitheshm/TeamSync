import { IUsers } from "../../entities/UserEntity";

export interface IUserRepository {
    create(user: IUsers): Promise<void>
    verifyUser(email: string): Promise<void>
}