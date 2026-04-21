const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const consultar = require('../../../public/js/consulta_model');


router.get('/', async (req, res) => {
    try {
      res.render('dibujo');
    } catch (error) {
      console.error('Error al cargar la pagina de dibujo', error);
      res.status(500).send('Error al optener las opciones.');
    }
  });

router.get('/categorias', async (req, res) => {
    try {
      const result = await consultar.categorias_carto();
      res.send(result);
    } catch (error) {
      console.error('Error al cargar la pagina de dibujo', error);
      res.status(500).send('Error al optener las opciones.');
    }
  });

module.exports = router;