const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      res.render('dibujo');
    } catch (error) {
      console.error('Error al cargar la pagina de dibujo', error);
      res.status(500).send('Error al optener las opciones.');
    }
  });

module.exports = router;