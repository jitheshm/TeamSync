import nodemailer from 'nodemailer';

const mailerConfig = {
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD
};

export const sendBugTicketMail = (emails: string[], bugTitle: string, bugDescription: string) => {

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
        subject: `New Bug Ticket: ${bugTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <h2 style="color: #FF4500;">New Bug Ticket Raised</h2>
              <p>Dear team member,</p>
              <p>A new bug ticket has been raised and requires attention.</p>
              <p><strong>Bug Title:</strong> ${bugTitle}</p>
              <p><strong>Description:</strong></p>
              <p>${bugDescription}</p>
              <p>Please review the bug details and take necessary action as soon as possible.</p>
              <p>If you need any additional information or clarification, please contact the reporting team member.</p>
              <p>Best regards,</p>
              <p>TeamSync Bug Tracking System</p>
            </div>
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