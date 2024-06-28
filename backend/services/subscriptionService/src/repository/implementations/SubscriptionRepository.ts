
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
            const res = await SubscriptionModel.findOne({ user_id: userId })
            return res
        } catch (error) {
            console.log('Error in SubscriptionRepository findSubscriptionByUserId method');

            console.log(error);

            throw error
        }



    }
}