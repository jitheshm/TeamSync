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
        subject: "otp for verification",
        html:  `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #4CAF50;">Your One-Time Password</h2>
          <p>Dear user,</p>
          <p>Thank you for using our service. Your OTP code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
          <p>This code is valid for 2 minutes. Please do not share this code with anyone.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p>Best regards,</p>
          <p>TeamSync</p>
        </div>
      `,
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