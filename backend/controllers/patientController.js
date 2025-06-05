const pool = require('../models/db');

// Pobierz wizyty pacjenta (na podstawie ID użytkownika z tokena lub sesji)
async function getAppointments(req, res) {
    try {
        // Załóżmy, że masz userId z autoryzacji (np. middleware auth)
        const userId = req.user.id;

        const [rows] = await pool.query(
            `SELECT a.id, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, a.visit_type, a.payment_method, a.payment_status, a.visit_date, a.visit_time
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = ?`,
            [userId]
        );

        // Przetworzenie wyników na format wymagany przez frontend
        const appointments = rows.map(r => ({
            id: r.id,
            doctor: `${r.doctor_first_name} ${r.doctor_last_name}`,
            visit_type: r.visit_type,
            payment_method: r.payment_method,
            payment_status: r.payment_status,
            visit_date: r.visit_date,
            visit_time: r.visit_time,
        }));

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
}

// Anulowanie wizyty
async function cancelAppointment(req, res) {
    try {
        console.log("TEMP 1-asercja00000pppppp")
        const appointmentId = req.params.id;
        const userId = req.user.id; // autoryzacja wymagana

        // Sprawdź, czy wizyta należy do użytkownika
        const [rows] = await pool.query(
            `SELECT id FROM appointments WHERE id = ? AND patient_id = ?`,
            [appointmentId, userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Wizyta nie znaleziona' });
        }

        // Usuń wizytę (lub zmień status anulowania)
        await pool.query(`DELETE FROM appointments WHERE id = ?`, [appointmentId]);
        res.json({ message: 'Wizyta anulowana' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
}


async function getProfile(req, res) {
    try {
        const userId = req.user.id;

        /*const [rows] = await pool.query(
            'SELECT id, first_name, last_name, email, phone, age FROM patients WHERE id = ?',
            [userId]
        );*/

        const [rows] = await pool.query(
            'SELECT id, first_name, last_name, email, phone, age, height, weight FROM patients WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pacjent nie znaleziony' });
        }

        const profile = rows[0];
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
}



async function getTakenSlots(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT visit_date, visit_time FROM appointments`
        );

        const takenSlots = rows.map(row => ({
            date: row.visit_date,
            time: row.visit_time
        }));
        res.json(takenSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
}

module.exports = {
    getAppointments,
    cancelAppointment,
    getProfile,
    getTakenSlots
};
