import mongoose from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantRepository {
    create(data: ITenants): Promise<mongoose.Schema.Types.ObjectId>;
}
