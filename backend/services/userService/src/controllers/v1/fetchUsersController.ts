import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUserRepository } from "../../repository/interface/IUserRepository";

let userRepo: IUserRepository = new UserRepository()

export default async (req: Request, res: Response) => {
    try {

        const name = req.query.name as string | null
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 1000)

        let result = await userRepo.fetchAllUsers(name, page, limit)
        res.status(200).json({ data: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}