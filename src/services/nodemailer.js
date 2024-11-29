const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const send = (to, subject, html) => {
    transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html
    })
}

module.exports = send;