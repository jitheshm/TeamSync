import { Request, Response } from "express";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import mongoose from "mongoose";

let userRepo: IUserRepository = new UserRepository()
export default async(req: Request, res: Response) => {
    try {
        if (req.params.userId) {

            let users =await userRepo.updateUserById({ _id: new mongoose.Types.ObjectId(req.params.userId), is_blocked: true })
            if(users.modifiedCount>0){

                res.status(200).json({ data: users })
            }else{
                res.status(404).json({ error: "User not found" })
            }
        } else {
            res.status(400).json({ error: "User Id is required" })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}