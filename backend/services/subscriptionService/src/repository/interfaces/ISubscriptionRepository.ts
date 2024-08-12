import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import ISubscriptions from "../../entities/SubscriptionEntity";


export interface ISubscriptionRepository {
    create(data: Partial<ISubscriptions>): Promise<ISubscriptions & Document>
    update(data: Partial<ISubscriptions>,transaction?:any): Promise<ISubscriptions & Document | null>
    findSubscriptionByUserId(userId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>
    fetchAllSubscriptions(name: string | null, page: number, limit: number): Promise<{
        data: any[];
        total: any;
    }>
    fetchMonthlyProfit(): Promise<{ total_earned: number }>
    fetchPlanStats(): Promise<any[]>


}