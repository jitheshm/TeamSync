import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { IMeetingService } from "../../services/interfaces/IMeetingService";
import { nanoid } from "nanoid";
import IMeetingEnitity from "../../entities/MeetingEntity";
import mongoose from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { IMeetingController } from "../interfaces/IMeetingController";

@injectable()
export class MeetingController implements IMeetingController {
    private meetingService: IMeetingService;

    constructor(@inject("IMeetingService") meetingService: IMeetingService) {
        if (!meetingService) {
            console.log("meetingController: meetingService is null or undefined");
        }
        this.meetingService = meetingService;
    }

    async createMeeting(req: Request & Partial<{ user: IDecodedUser }>, res: Response, next: NextFunction) {
        try {
            const dataObj = req.body as IMeetingEnitity
            dataObj.scheduledBy = new mongoose.Types.ObjectId(req.user?.decode?.id as string)
            dataObj.meetingLink = nanoid()
            await this.meetingService.createMeeting(req.user?.decode?.tenantId as string, req.body);

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async fetchMeetings(req: Request & Partial<{ user: IDecodedUser }>, res: Response, next: NextFunction) {
        try {
            const { search, page, limit } = req.query as { search: string | null, page: string, limit: string };
            const data = await this.meetingService.fetchMeetings(req.user?.decode?.tenantId as string, new mongoose.Types.ObjectId(req.user?.decode?.id as string), search ?? null, page ? Number(page) : 1, limit ? Number(limit) : 10);
            res.status(200).json({ data: data.data, total: data.totalCount });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}