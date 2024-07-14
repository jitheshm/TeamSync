import { IUsers } from "../../entities/UserEntity";

export interface IUserService {
    verifyUserToken(token: string): Promise<any | null>;
    createUserFromFirebase(decodedToken: any): Promise<any>;
    authenticateUser(email: string, password: string): Promise<any>;
}
