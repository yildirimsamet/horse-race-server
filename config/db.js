require('dotenv').config();
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env_DB_HOST,
    user: process.env_DB_USER,
    password: process.env_DB_PASSWORD,
    database: process.env_DB_NAME
});
module.exports = pool.promise();