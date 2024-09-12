import nodemailer from 'nodemailer';

const mailerConfig = {
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD
};

export const sendRemainderMail = (emails: string[], title: string, date: Date, time: string, link: string) => {
    console.log("remainder sending");

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: mailerConfig.nodemailerEmail,
            pass: mailerConfig.nodemailerPassword,
        }
    });

    const mailOptions = (email: string) => ({
        from: mailerConfig.nodemailerEmail,
        to: email,
        subject: `Meeting Remainder: ${title}`,
        html: `
            <h1>Meeting Scheduled</h1>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Join Id:</strong> ${link}</p>
            <p>Please make sure to be on time. Looking forward to your participation.</p>
        `,
    });

    emails.forEach(email => {
        transporter.sendMail(mailOptions(email), (error, info) => {
            if (error) {
                console.error(`Error sending email to ${email}:`, error);
            } else {
                console.log(`Email sent to ${email}:`, info.response);
            }
        });
    });
};
