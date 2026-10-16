const mysql = require ('mysql2');
require('dotenv').config();

const conexion = mysql.createPool ({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    //user: 'marco',
    password: process.env.MYSQL_PASSWORD,
    database: 'ddjj_production',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const promisePool = conexion.promise()

module.exports = promisePool;

