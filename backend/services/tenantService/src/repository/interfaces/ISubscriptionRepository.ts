import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import ISubscriptions from "../../entities/SubscriptionEntity";


export interface ISubscriptionRepository {
    create(data: Partial<ISubscriptions>): Promise<void>
    update(data: Partial<ISubscriptions>): Promise<void>
    findSubscriptionByUserId(userId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>
    fetchAllowedBranchCount(tenantId: mongoose.Types.ObjectId): Promise<number>
    fetchSubscription(tenantId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>



}