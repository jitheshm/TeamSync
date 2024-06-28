
import mongoose, { Mongoose, ObjectId } from "mongoose";

import switchDb from "../../utils/switchDb";
import ISubscriptions from "../../entities/SubscriptionEntity";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";





export default class SubscriptionRepository implements ISubscriptionRepository {

    async create(data: ISubscriptions) {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            const subscription = new SubscriptionModel(data)
            await subscription.save()
        } catch (error) {
            console.log('Error in SubscriptionRepository create method');

            console.log(error);

            throw error
        }
    }

    async update(data: ISubscriptions) {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            const res = await SubscriptionModel.updateOne({ stripe_subscription_id: data.stripe_subscription_id }, data)

        } catch (error) {
            console.log('Error in SubscriptionRepository update method');

            console.log(error);

            throw error
        }
    }

    async findSubscriptionByUserId(userId: mongoose.Types.ObjectId) {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            const res = await SubscriptionModel.aggregate([
                {
                    $match:{
                        user_id:userId
                    }
                },
                {
                    $lookup: {
                        from: 'plans',
                        localField: 'plan_id',
                        foreignField: 'stripe_plan_id',
                        as: 'plan'
                    }
                },
                {
                    $lookup: {
                        from: 'tenants',
                        localField: 'tenant_id',
                        foreignField: '_id',
                        as: 'tenant'
                    }
                },
                {
                    $unwind: '$plan'
                },
                // {
                //     $unwind: '$tenant'
                // },
                {
                    $project: {
                        _id: 1,
                        subscription_id: 1,
                        stripe_subscription_id: 1,
                        tenant_id: 1,
                        plan_id: 1,
                        user_id: 1,
                        stripe_latest_invoice: 1,
                        stripe_customer_id: 1,
                        status: 1,
                        payment_method: 1,
                        renewal_date: 1,
                        plan: {
                            _id: 1,
                            name: 1,
                            price: 1,
                            description: 1,
                            currency: 1,
                            interval: 1,
                            trial_period_days: 1,
                            status: 1
                        },
                        tenant: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            status: 1
                        }
                    }
                
                }
            ]).exec()
            console.log(res);
            
            return res[0]
        } catch (error) {
            console.log('Error in SubscriptionRepository findSubscriptionByUserId method');

            console.log(error);

            throw error
        }



    }
}