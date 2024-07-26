import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUserRepository } from "../../repository/interface/IUserRepository";

let userRepo: IUserRepository = new UserRepository()

export default async (req: Request, res: Response) => {
    try {



        let result = await userRepo.fetchUsersStats()
        res.status(200).json({ data: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}