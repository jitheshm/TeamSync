
export interface IUserService {
    verifyUserToken(token: string): Promise<any | null>;
    createUserFromFirebase(decodedToken: any): Promise<any>;
}
