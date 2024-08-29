import { fetchSubscriptionDetails } from '@/api/subscriptionService/subscription'
import React, { useEffect } from 'react'
import Empty from '../../common/Empty';
import { ISubscriptionDetails } from '@/interfaces/subscription';

interface SubscriptionDetailsProps {
    userId: string;
    subscriptionDetails: ISubscriptionDetails | null;
    setSubscriptionDetails: React.Dispatch<React.SetStateAction<ISubscriptionDetails | null>>;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ userId, subscriptionDetails, setSubscriptionDetails }) => {
    useEffect(() => {
        fetchSubscriptionDetails(userId).then((res) => {
            setSubscriptionDetails(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [userId]);

    return (
        <div className="bg-gray-700 p-3 hover:shadow">
            <h2 className='font-bold'>Subscription Details</h2>
            {subscriptionDetails ? (
                <div className='mt-5 flex flex-col gap-5'>
                    <div className='flex justify-between'>
                        <p>SubscriptionId</p>
                        <p>{subscriptionDetails.subscription_id}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Plan Name</p>
                        <p>{subscriptionDetails.plan.name}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Company name</p>
                        <p>{subscriptionDetails.tenant.company_name}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Stripe subscription id</p>
                        <p>{subscriptionDetails.stripe_subscription_id}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Latest invoice id</p>
                        <p>{subscriptionDetails.stripe_latest_invoice}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Start Date</p>
                        <p>{subscriptionDetails.start_date ? new Date(subscriptionDetails.start_date).toISOString() : ""}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Renewal Date</p>
                        <p>{subscriptionDetails.renewal_date ? new Date(subscriptionDetails.renewal_date).toISOString() : ""}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Status</p>
                        <p>{subscriptionDetails.status}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Payment Method</p>
                        <p>{subscriptionDetails.payment_method}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Bill Cycle</p>
                        <p>{subscriptionDetails.plan.bill_cycle}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Currency</p>
                        <p>{subscriptionDetails.plan.currency}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Meeting Size</p>
                        <p>{subscriptionDetails.plan.features.meetings}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Max Branches</p>
                        <p>{subscriptionDetails.plan.features.branches}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Support</p>
                        <p>{subscriptionDetails.plan.features.support}</p>
                    </div>
                </div>
            ) : (
                <Empty />
            )}
        </div>
    );
};

export default SubscriptionDetails;
