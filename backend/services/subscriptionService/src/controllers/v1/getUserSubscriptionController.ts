
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import mongoose from "mongoose";
import { Request, Response } from "express";
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository();

export default async (req: Request, res: Response) => {
    try {
        let userId = new mongoose.Types.ObjectId(req.params.userId);

        let data = await subscriptionRepository.findSubscriptionByUserId(userId)
        if (data) {
            res.status(200).json({ data: data })
        } else {
            res.status(404).json({ message: "No subscription found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}