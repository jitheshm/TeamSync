import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import ISubscriptions from "../../entities/SubscriptionEntity";


export interface ISubscriptionRepository {
    create(data: Partial<ISubscriptions>): Promise<ISubscriptions & Document>
    update(data: Partial<ISubscriptions>): Promise<ISubscriptions & Document |null>
    findSubscriptionByUserId(userId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>
    fetchAllSubscriptions(): Promise<ISubscriptions[]>



}