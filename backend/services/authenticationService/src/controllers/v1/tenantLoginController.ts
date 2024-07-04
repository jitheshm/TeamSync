import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import { generateOtp } from "../../utils/otp";
import OtpRepository from "../../repository/implementations/OtpRepository";
import OtpProducer from "../../events/kafka/producers/OtpProducer";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";

const tenantUserRepository: ITenantUserRepository = new TenantUserRepository();
const kafkaConnection = new KafkaConnection()

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


        let otp = generateOtp()
        let otpRepository = new OtpRepository()
        let otpObj = {
            email: bodyObj.email,
            otp: `${otp}`,
            context: 'tenant_login'
        }
        await otpRepository.create(otpObj, bodyObj.email)


        let producer = await kafkaConnection.getProducerInstance()
        let otpProducer = new OtpProducer(producer, 'main', 'otps')
        otpProducer.sendMessage('create', otpObj)

        // const token = jwt.sign({ email: userData.email, name: userData.name, id: userData._id, tenantId: bodyObj.tenantId, role: userData.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        // res.status(200).json({ message: "User verified", verified: true, token: token, name: userData.name, tenantId: bodyObj.tenantId, role: userData.role });
        res.status(200).json({ message: "OTP sent to email" });



    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}