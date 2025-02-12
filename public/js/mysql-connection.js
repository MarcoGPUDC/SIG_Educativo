const mysql = require ('mysql2');


const conexion = mysql.createPool ({
    host: '172.16.0.15',
    //user: 'sigeducativo',
    user: 'marco',
    password: 'sigadmin',
    database: 'ddjj_production',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const promisePool = conexion.promise()

module.exports = promisePool;

