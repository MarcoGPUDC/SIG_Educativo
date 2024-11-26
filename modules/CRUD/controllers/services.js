const express = require('express');
const router = express.Router();
const {Pool} = require('pg')
const app = express();
const pool = new Pool({
  user:'postgres',
  host:'localhost',
  database:'nuevo_mapa_db',
  password:'admin',
  port:5432,
})
router.get('/crud/convert', async (req, res) => {
    const { lng, lat } = req.query;
  
    if (!lng || !lat) {
      return res.status(400).json({ error: 'Faltan parámetros de coordenadas.' });
    }
  
    try {
      const query = `
        SELECT ST_AsText(
          ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 22172)
        ) AS converted_geom
      `;
      const values = [lng, lat];
      const result = await pool.query(query, values);
      res.json({ geom: result.rows[0].converted_geom });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al convertir coordenadas.' });
    }
  });

  router.get('/crud/exist', async (req, res) => {
    const value = req.query.id;  
    try {
      const query = `
        SELECT EXISTS (
            SELECT 1
            FROM padron.institucion
            WHERE cue_anexo = $1
        );
      `;
      const result = await pool.query(query, [value]);
      res.json(result.rows[0]['exists']);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al convertir coordenadas.' });
    }
  });



  module.exports = router;