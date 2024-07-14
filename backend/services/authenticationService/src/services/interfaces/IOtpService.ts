// src/services/interfaces/IOtpService.ts

export interface IOtpService {
    sendOtpForPasswordReset(email: string): Promise<void>;
}
