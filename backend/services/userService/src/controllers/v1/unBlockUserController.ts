import { Request, Response } from "express";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import mongoose from "mongoose";

let userRepo: IUserRepository = new UserRepository()
export default (req: Request, res: Response) => {
    try {
        let users = userRepo.updateUserById({ _id: new mongoose.Schema.Types.ObjectId(req.params.userId), is_blocked: false })
        res.status(200).json({ data: users })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}