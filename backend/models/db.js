const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'mysql8',
    port: 3306,
    user: '36948764_clinic',
    password: 'haslo140786',
    database: '36948764_clinic',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
