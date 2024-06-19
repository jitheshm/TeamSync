import nodemailer from 'nodemailer'

const mailerConfig = {
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD
}

export const sendMail = (email: string, otp: number) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: mailerConfig.nodemailerEmail,
            pass: mailerConfig.nodemailerPassword,
        }
    })
    const mailOptions = {
        from: mailerConfig.nodemailerEmail,
        to: email,
        subject: "otp for signup",
        html: `<h1>Here is your OTP: ${otp}</h1>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}