import { Request, Response } from "express";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";

const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository();

export default async (req: Request, res: Response) => {
    try {

        const name = req.query.name as string | null
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 1000)

        const subscriptions = await subscriptionRepository.fetchAllSubscriptions(name, page, limit)
        res.status(200).json({ data: subscriptions })
    } catch (error) {
        console.log('Error in getAllSubscriptionController');
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}