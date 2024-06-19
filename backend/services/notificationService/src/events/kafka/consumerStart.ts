

import OtpConsumer from "./consumers/OtpConsumer"

export const connectConsumers = () => {
    let otpConsumer:OtpConsumer = new OtpConsumer()

    otpConsumer.newOtp()
} 