import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import mongoose from "mongoose";

let userRepo: IUserRepository = new UserRepository()

export default async (req: Request, res: Response) => {
    try {
        let userId = new mongoose.Types.ObjectId(req.params.userId)
        let users = await userRepo.fetchSpecificUser(userId)
        if (users) {
            res.status(200).json({ data: users })
        } else {
            res.status(404).json({ error: "User not found" })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}