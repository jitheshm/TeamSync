import { Document } from "mongoose";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";


export interface ITenantUserService {
    getAvailableTenantUsers(user: IDecodedUser, role: string | undefined): Promise<(ITenantUsers&Document)[]>;
}
