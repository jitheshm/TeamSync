import { Document } from "mongoose";
import { IUsers } from "../../entities/UserEntity";
import { ITenants } from "../../entities/TenantEntity";

interface IFetchReturn extends IUsers {
    tenant?: ITenants[]
}
export interface IUserRepository {
    create(user: Partial<IUsers>): Promise<IUsers & Document>
    verifyUser(email: string): Promise<IUsers & Document>
    fetchUser(email: string): Promise<IFetchReturn & Document | null>
    fetchUserByAuthId(authentication_id: string): Promise<IFetchReturn & Document | null>
    updateUser(data: Partial<IUsers & Document>): Promise<IUsers & Document | null>
}