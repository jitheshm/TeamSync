

import OtpConsumer from "./consumers/OtpConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer:UserConsumer = new UserConsumer()
    let otpConsumer:OtpConsumer = new OtpConsumer()
    userConsumer.newUser()
    otpConsumer.newOtp()
} 