import { ObjectId } from "mongoose";

interface IFeatures {
    branches: number;
    meetings: number;
    support: 'basic' | 'expert';
}

interface IPlan {
    _id: ObjectId
    plan_id: string;
    description: string;
    bill_cycle: 'monthly' | 'yearly';
    features: IFeatures;
    price: string;
    name: string;
    currency: 'indian' | 'dollar';
    created_at: Date;
    active: boolean;
    is_deleted: boolean;

}

export default IPlan;
