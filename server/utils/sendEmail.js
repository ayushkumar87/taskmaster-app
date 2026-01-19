const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if SMTP credentials are provided
    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL) {
        console.log('---------------------------------------------------');
        console.log(' WARNING: SMTP credentials not found in .env');
        console.log(' [MOCK EMAIL SERVICE] simulating email sending...');
        console.log(` To: ${options.email}`);
        console.log(` Subject: ${options.subject}`);
        console.log(` Message: \n${options.message}`);
        console.log('---------------------------------------------------');
        return; // Return early, treating it as a success
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
