require('dotenv').config();
const pgp = require('pg-promise')();

function conectarDB() {
    const connectionString = process.env.DB_DOCKER || process.env.DB_LOCAL;
    return pgp(connectionString);
}

module.exports = conectarDB;
