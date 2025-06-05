const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    const jwt = require('jsonwebtoken');

    try {
        const [rows] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
        }

        const user = rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'your_jwt_secret',  // użyj swojej sekretnej frazy
            { expiresIn: '1h' }
        );

        // Jeśli hasła nie są hash’owane w bazie, to zastąp tą linię:
        //const validPassword = await bcrypt.compare(password, user.password);

        // Jeśli nie masz hash’owania to:
        const validPassword = (password === user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
        }

        //return res.json({ message: 'Zalogowano pomyślnie', userId: user.id });
        return res.json({ message: 'Zalogowano pomyślnie jako lekarz', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Błąd serwera' });
    }
};

