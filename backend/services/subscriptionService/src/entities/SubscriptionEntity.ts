import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export default interface ISubscriptions extends Document {
    _id: ObjectId;
    subscription_id: String;
    tenent_id: ObjectId;
    start_date: Date;
    plan_id: ObjectId;
    stripe_latest_invoice:string;
    stripe_customer_id:string
    stripe_payment_intent:string
    renewal_date: Date;
    cancel_date: Date | null
    status: String;
    payment_method: String;
    transactions: {
        amount: String;
        date: Date;
        status: String;
        transaction_id: String;
    }[] | null;
}