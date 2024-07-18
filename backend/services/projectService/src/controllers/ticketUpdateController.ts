
import { validationResult } from "express-validator";
import IDecodedUser from "../interfaces/IDecodeUser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { ITicketRepository } from "../repository/interfaces/ITicketRepository";
import TicketRepository from "../repository/implementations/TicketRepository";
import TicketService from "../services/implementations/TicketService";
import { ITickets } from "../entities/TicketEntity";
import { FileArray } from "express-fileupload";
import cloudinary from 'cloudinary';


const ticketRepository: ITicketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);

export default async (req: Request & Partial<{
    user: IDecodedUser,
    files: FileArray | null | undefined;
    uploadedFiles?: string[];
}>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const bodyObj: Partial<ITickets & { oldImageUrl: string[] }> = req.body as Partial<ITickets & { oldImageUrl: string[] }>

        if (req.uploadedFiles)
            bodyObj.upload_images = req.uploadedFiles

        if (req.body.oldImageUrl) {
            bodyObj.oldImageUrl = req.body.oldImageUrl
        }

        console.log(bodyObj,"bodyObj"); 
        


        const resultObj = await ticketService.updateTicket(req.params.ticketId, bodyObj, req.user?.decode?.tenantId);

        if (resultObj) {
            const filesToDelete = req.body.oldImageUrl
            console.log(filesToDelete);
            if (filesToDelete)
                for (const file of filesToDelete) {
                    const public_id = file.replace(/\.[^/.]+$/, "");
                    console.log(public_id);
                    cloudinary.v2.uploader.destroy(public_id).then(() => {
                        console.log("file deleted");
                    });
                }
        }

        if (!resultObj) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task: resultObj });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
