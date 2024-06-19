import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        email: {
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        otp: {
            matches: {
                options: /^[0-9]{6}$/,
                errorMessage: 'OTP should be a string containing exactly 6 digits'
            }
        }
    }
}
