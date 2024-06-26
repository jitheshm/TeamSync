
import mongoose, { ObjectId } from "mongoose";

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

    

}