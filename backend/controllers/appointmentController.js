const { Appointment } = require('../models');  // Załaduj model
const nodemailer = require('nodemailer');
const { createAppointment } = require('../models/appointmentModel');
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../utils/mailer');
require('dotenv').config();


exports.createAppointment = async (req, res) => {
    try {
        const data = req.body;

        if (!data.visit_code) {
            data.visit_code = `VISIT-${Date.now()}`;
        }

        const result = await createAppointment(data);

        await sendEmails(data);

        res.status(201).json({ message: 'Wizyta zapisana', appointmentId: result.insertId });
    } catch (err) {
        console.error('Błąd podczas tworzenia wizyty:', err);
        res.status(500).json({ error: 'Coś poszło nie tak', details: err.message });
    }
};

async function sendEmails(data) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,      // np. serwer2309035.home.pl
        port: Number(process.env.SMTP_PORT), // 25
        secure: false,                    // port 25 → STARTTLS (nie SSL/TLS od razu)
        auth: {
            user: process.env.EMAIL_USER,   // np. rezerwacje.serwer2309035
            pass: process.env.EMAIL_PASS    // hasło do skrzynki
        },
        tls: {
            rejectUnauthorized: false       // w Home.pl często trzeba to wyłączyć, żeby nie odrzucało certyfikatu
        }
    });

    const mailToDoctor = {
        from: `"System Rezerwacji" <rezerwacje@moroch.pl>`,
        to: 'amoroch@onet.pl',
        subject: `Nowa wizyta - ${data.visit_date} ${data.visit_time}`,
        text: `Pacjent: ${data.patient_first_name} ${data.patient_last_name}
Email: ${data.patient_email}
Telefon: ${data.patient_phone}
Data i godzina: ${data.visit_date} ${data.visit_time}
Rodzaj wizyty: ${data.visit_type}
Forma płatności: ${data.payment_method}
Objawy: ${data.symptoms}`
    };

    const mailToPatient = {
        from: `"System Rezerwacji" <rezerwacje@moroch.pl>`,
        to: data.patient_email,
        subject: 'Potwierdzenie rezerwacji wizyty',
        text: `Dziękujemy za rezerwację wizyty u lekarza na dzień ${data.visit_date} o godzinie ${data.visit_time}.
    
Szczegóły wizyty:
Rodzaj wizyty: ${data.visit_type}
Forma płatności: ${data.payment_method}

W razie pytań prosimy o kontakt.`
    };

    await transporter.sendMail(mailToDoctor);
    await transporter.sendMail(mailToPatient);
}
