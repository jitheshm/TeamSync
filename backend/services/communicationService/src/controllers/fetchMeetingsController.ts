import { Request, Response } from "express";
import IDecodedUser from "../interfaces/IDecodeUser";
import MeetingRepository from "../repository/implementations/MeetingRepository";
import { IMeetingRepository } from "../repository/interfaces/IMeetingRepository";
import { validationResult } from "express-validator";
import mongoose from "mongoose";


const meetingRepository: IMeetingRepository = new MeetingRepository()
export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { search, page, limit } = req.query as { search: string|null, page: string, limit: string };

        console.log(req.user?.decode);
        
        const data=await meetingRepository.fetchMeetings(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.user?.decode?.id as string),search??null, page?Number(page):1, limit?Number(limit):10);
        

        res.status(201).json({ data: data.data, total: data.totalCount });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}