const express = require('express');
const router = express.Router();
const consultar = require('./public/js/consulta_model');

router.get('/getDataEtp', async (req, res) => {
  try {
      const data = await consultar.getEtpData();
      res.send(data);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });

  module.exports = router;