import { ObjectId } from "mongoose";

interface IFeatures {
    branches: number;
    meetings: number;
    support: 'basic' | 'expert';
}

interface IPlan {
    plan_id: string;
    stripe_plan_id: string;
    description: string;
    bill_cycle: 'month' | 'year';
    features: IFeatures;
    price: string;
    name: string;
    currency: 'usd';
    created_at: Date;
    active: boolean;
    is_deleted: boolean;

}

export default IPlan;
