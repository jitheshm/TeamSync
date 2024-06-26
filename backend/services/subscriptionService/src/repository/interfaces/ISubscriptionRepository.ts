import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import ISubscriptions from "../../entities/SubscriptionEntity";


export interface ISubscriptionRepository {
    create(data: Partial<ISubscriptions>): Promise<void>
    
}