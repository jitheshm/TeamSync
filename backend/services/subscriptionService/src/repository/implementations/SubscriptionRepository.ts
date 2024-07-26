
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
            return subscription
        } catch (error) {
            console.log('Error in SubscriptionRepository create method');

            console.log(error);

            throw error
        }
    }

    async update(data: ISubscriptions) {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            const res = await SubscriptionModel.findOneAndUpdate({ stripe_subscription_id: data.stripe_subscription_id }, data, { new: true })
            return res
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
                    $match: {
                        user_id: userId
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
                {
                    $unwind: '$tenant'
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

    async fetchAllSubscriptions(name: string, page: number, limit: number) {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            let data = null;

            const matchStage: any = {

            };


            if (name) {
                matchStage['user.email'] = { $regex: `^${name}`, $options: 'i' };
            }
            data = await SubscriptionModel.aggregate([



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
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'

                    }
                },
                {
                    $unwind: '$plan'
                },
                {
                    $unwind: '$tenant'
                },
                {
                    $unwind: '$user'

                },
                {
                    $match: matchStage
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
                , {
                    $project: {
                        _id: 1,
                        subscription_id: 1,
                        user: {
                            _id: 1,
                            email: 1
                        },
                        plan: {
                            name: 1
                        },
                        tenant: {
                            company_name: 1
                        },

                    }
                }

            ]).exec()
            console.log(data);

            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];

            const totalCountResult = await SubscriptionModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;


            return { data, total };
        } catch (error) {
            console.log('Error in SubscriptionRepository update method');

            console.log(error);

            throw error
        }
    }

    async fetchMonthlyProfit() {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')

            const data = await SubscriptionModel.aggregate([
                {
                    $match: {
                        status: "paid",
                        renewal_date: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
                        }
                    }
                },
                {
                    $lookup: {
                        from: "plans",
                        localField: "plan_id",
                        foreignField: "stripe_plan_id",
                        as: "plan_details"
                    }
                },
                {
                    $unwind: "$plan_details"
                },
                {
                    $group: {
                        _id: null,
                        total_earned: { $sum: { $toDouble: "$plan_details.price" } }
                    }
                }
            ])
            console.log(data);

            return data[0]
        } catch (error) {
            throw error
        }
    }

    async fetchPlanStats() {
        try {
            const SubscriptionModel = switchDb<ISubscriptions>(`${process.env.SERVICE}_main`, 'subscriptions')
            const data = await SubscriptionModel.aggregate([
                {
                    $group: {
                        _id: "$plan_id",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "plans",
                        localField: "_id",
                        foreignField: "stripe_plan_id",
                        as: "plans"

                    }
                },
                {
                    $unwind: "$plans"
                }

            ]).exec()
            console.log(data);
            

            return data

        } catch (error) {
            throw error
        }
    }
}