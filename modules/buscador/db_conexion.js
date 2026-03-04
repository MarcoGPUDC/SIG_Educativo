require('dotenv').config();
const pgp = require('pg-promise')();

async function conectarDB() {

    const conexiones = [
        process.env.DB_LOCAL,    
        process.env.DB_DOCKER
    ];

    for (let conn of conexiones) {
        try {
            const db = pgp(conn);
            await db.one('SELECT 1');
            return db;
        } catch (error) {
        }
    }

    throw new Error('No se pudo conectar a ninguna base de datos');
}


module.exports = conectarDB;
