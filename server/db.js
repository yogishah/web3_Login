const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'testDB',
    connectionLimit: 10 // Adjust as needed
});

module.exports = pool;