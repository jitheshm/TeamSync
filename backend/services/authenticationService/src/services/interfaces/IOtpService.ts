// src/services/interfaces/IOtpService.ts

export interface IOtpService {
    sendOtpForPasswordReset(email: string): Promise<void>;
    verifyOtp(email: string, otp: string, context: string): Promise<boolean>
}
