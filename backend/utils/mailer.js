// backend/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.home.pl',
    port: 587,
    secure: false,
    auth: {
        user: 'rezerwacje@moroch.pl',
        pass: 'TWOJE_HASŁO'
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendEmail(to, subject, html) {
    return transporter.sendMail({
        from: '"Rejestracja wizyt" <rezerwacje@moroch.pl>',
        to,
        subject,
        html
    });
}

module.exports = { sendEmail };
