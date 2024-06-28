import { Schema } from 'mongoose';
import ISubscriptions from '../entities/SubscriptionEntity';



const SubscriptionSchema: Schema = new Schema<ISubscriptions>({
    subscription_id: { type: String, required: true, unique: true },
    stripe_subscription_id: { type: String, required: true, unique: true },
    tenant_id: { type: Schema.Types.ObjectId, required: true },
    start_date: { type: Date, required: true, default: Date.now },
    plan_id: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    stripe_latest_invoice: { type: String, required: true },
    stripe_customer_id: { type: String, required: true },
    stripe_payment_intent: { type: String },
    renewal_date: { type: Date, required: true },
    cancel_date: { type: Date },
    status: { type: String, required: true },
    payment_method: { type: String, required: true },
    transactions: [{
        amount: { type: String, required: true },
        date: { type: Date, required: true },
        status: { type: String, required: true },
        transaction_id: { type: String, required: true },
    }],
});

export default SubscriptionSchema;