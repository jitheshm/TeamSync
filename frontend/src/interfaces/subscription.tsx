interface IFeatures {
    branches: number;
    meetings: number;
    support: string;
}

interface IPlan {
    plan_id: string;
    stripe_plan_id: string;
    description: string;
    bill_cycle: string
    features: IFeatures;
    price: string;
    name: string;
    currency: string
    created_at: Date;
    active: boolean;
    is_deleted: boolean;

}

interface IAddress {
    building_no: string;
    city: string;
    country: string;
    postal_code: string;
    state: string;
    street: string;
}

interface ITenants {
    _id: string;
    tenant_id: string;
    register_date: Date;
    company_name: string;
    company_type: string;
    address: IAddress;
    phone_no: string;
    domain: string | null;
    user_id: string;
}

 export interface ISubscriptionDetails {
    _id: string;
    subscription_id: String;
    stripe_subscription_id: string;
    tenant_id: string;
    start_date: Date;
    plan_id: string;
    user_id: string;
    plan: IPlan;
    tenant: ITenants;
    stripe_latest_invoice: string;
    stripe_customer_id: string;
    stripe_payment_intent: string;
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