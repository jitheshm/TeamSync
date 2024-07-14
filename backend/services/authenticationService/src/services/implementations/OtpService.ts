

import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import { generateOtp, sendOtp } from "../../utils/otp";
import { IOtpService } from '../interfaces/IOtpService';
import { IUserRepository } from "../../repository/interface/IUserRepository";

export default class OtpService implements IOtpService {
    private userRepository: IUserRepository;
    private otpRepository: IOtpRepository;
    private kafkaConnection: IKafkaConnection;

    constructor(userRepository: IUserRepository, otpRepository: IOtpRepository, kafkaConnection: IKafkaConnection) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.kafkaConnection = kafkaConnection;
    }

    public async sendOtpForPasswordReset(email: string): Promise<void> {
        const userData = await this.userRepository.fetchUser(email);
        if (!userData) {
            throw new Error('User not found');
        }
        if (userData.is_blocked) {
            throw new Error('User is blocked');
        }


        sendOtp(email, 'forgot-password');



    }
}
