import nodemailer from 'nodemailer';

const mailerConfig = {
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD
};

export const sendMail = (emails: string[], TaskName: string, TaskDetails: string) => {

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
        subject: `New Task Assigned: ${TaskName}`,
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <h2 style="color: #4CAF50;">New Project Assigned</h2>
              <p>Dear user,</p>
              <p>We are pleased to inform you that a new task has been assigned to you.</p>
              <p><strong>Task Name:</strong> ${TaskName}</p>
              <p><strong>Task Details:</strong></p>
              <p>${TaskDetails}</p>
              <p>Please review the task details and get started at your earliest convenience.</p>
              <p>If you have any questions, please feel free to reach out.</p>
              <p>Best regards,</p>
              <p>TeamSync</p>
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
