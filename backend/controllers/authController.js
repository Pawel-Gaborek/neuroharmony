const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const jwt = require('jsonwebtoken');

    try {
        const [rows] = await pool.query('SELECT * FROM patients WHERE email = ?', [email]);

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
        return res.json({ message: 'Zalogowano pomyślnie', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Błąd serwera' });
    }
};

exports.register = async (req, res) => {
    const { first_name, last_name, email, phone, password, age, height, weight } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }

    try {
        const [existing] = await pool.query('SELECT id FROM patients WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email jest już zajęty' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO patients 
                (first_name, last_name, email, phone, password, age, height, weight) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name || null,
                last_name || null,
                email,
                phone || null,
                hashedPassword,
                age || null,
                height || null,
                weight || null
            ]
        );

        res.status(201).json({ message: 'Użytkownik zarejestrowany' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};
