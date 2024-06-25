import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response) => {







}