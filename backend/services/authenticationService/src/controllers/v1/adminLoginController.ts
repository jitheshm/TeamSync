import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AdminRepository from "../../repository/implementations/adminRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { user_name, password }: { user_name: string, password: string } = req.body;
        let adminRepo=new AdminRepository()
        const adminObj=await adminRepo.fetchUser(user_name)
        if(!adminObj){
            return res.status(404).json({error:"User not found"});
        }
        const resObj=await bcrypt.compare(password, adminObj.password)
        if(!resObj){
            return res.status(401).json({error:"Invalid email or password"});
        }

        if(!process.env.JWT_ADMIN_SECRET_KEY){
            return res.status(500).json({error:"An unexpected error occurred. Please try again later."})
        }

        const token = jwt.sign({name:'admin'},process.env.JWT_ADMIN_SECRET_KEY ,{expiresIn:'1h'});
        res.status(200).json({message:"admin verified",token:token});


    } catch (error) {
        console.log(error);
        res.status(500).json({error:"An unexpected error occurred. Please try again later."});
    }
}