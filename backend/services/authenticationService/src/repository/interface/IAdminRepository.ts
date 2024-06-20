import { Document } from "mongoose";
import { IAdmin } from "../../entities/AdminEntity";

export interface IAdminRepository {
    fetchUser(email: string): Promise<IAdmin & Document | null>
}