import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";

const tenantUserRepository: ITenantUserRepository = new TenantUserRepository();

export default async (req: Request, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }


        const bodyObj: { email: string, role: string, tenantId: string } = req.body;

        const userData = await tenantUserRepository.fetchSpecificUser(bodyObj.tenantId, bodyObj.email);


        if (!userData) {
            return res.status(401).json({ error: "Invalid email address" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
        }


        const token = jwt.sign({ email: userData.email, name: userData.name, id: userData._id, tenantId: bodyObj.tenantId, role: userData.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: "User verified", verified: true, token: token, name:  userData.name, tenantId: bodyObj.tenantId, role: userData.role  });



    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}