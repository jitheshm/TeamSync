import { Request, Response } from "express";
import { IUsers } from "../../entities/UserEntity";
import { Document } from "mongoose";
 
export default (req:Request & Partial<{ user:IUsers&Document}>,res:Response)=>{
    try {
        res.status(200).json({message:"Token verified",user:req.user?.first_name});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"An unexpected error occurred. Please try again later."});
    }
}