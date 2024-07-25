export interface IUserDetails {
    _id: string
    first_name: string;
    user_id: string;
    last_name: string;
    email: string;
    authentication_id: string;
    authentication_provider: string;
    stripe_customer_id: string;
    created_at: string;
    phone_no: string | null;
    is_blocked: boolean;
    is_deleted: boolean;
    is_verified: boolean;

}

export interface ReduxUserState {
    name: string;
    verified: boolean;
    tenantId: string;
    id: string;
}