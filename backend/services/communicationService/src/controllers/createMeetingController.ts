import { Request, Response } from "express";
import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { IMeetingRepository } from "../repository/interfaces/IMeetingRepository";
import MeetingRepository from "../repository/implementations/MeetingRepository";
import { KafkaConnection } from "../config/kafka/KafkaConnection";
import MeetingProducer from "../events/producers/MeetingProducer";
import IMeetingEnitity from "../entities/MeetingEntity";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import MeetingService from "../services/implementations/MeetingService";
import { IMeetingService } from "../services/interfaces/IMeetingService";
import { IKafkaConnection } from "teamsync-common";


const meetingRepository: IMeetingRepository = new MeetingRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()
const meetingService:IMeetingService = new MeetingService(meetingRepository);
export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const dataObj = req.body as IMeetingEnitity
        dataObj.scheduledBy = new mongoose.Types.ObjectId(req.user?.decode?.id as string)
        dataObj.meetingLink = nanoid()

        await meetingService.createMeeting(req.user?.decode?.tenantId as string, req.body);
        const tenantId = req.user?.decode?.tenantId as string;

        const producer = await kafkaConnection?.getProducerInstance();
        const tenantMeetingProducer = new MeetingProducer(producer!, tenantId, 'meetings');
        tenantMeetingProducer.sendMessage('create', req.body);


        res.status(201).json({ message: "Meeting Scheduled successfully" });



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });

    }
}