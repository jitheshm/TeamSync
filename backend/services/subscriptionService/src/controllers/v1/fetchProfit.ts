import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";


const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository()


export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response) => {
    try {

        const result = await subscriptionRepository.fetchMonthlyProfit()

        res.status(200).json({ data: result });


    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}