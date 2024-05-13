const express = require('express');
const router = express.Router();
const informacion = require('../../../public/js/consulta_model');


router.get('/', async (req, res) => {
    try {
      res.render('info_institucion');
    } catch (error) {
      // Manejar cualquier error que ocurra durante la obtención de las tareas
      console.error('Error al cargar el buscador', error);
      res.status(500).send('Error al optener las opciones.');
    }
  });

router.get('/obtenerDatos', async (req, res) => {
try {
    // Obtener todas las tareas utilizando el modelo de datos
    const data = await informacion.busqueda_simple(req.query.num);
    res.send(data);
} catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos.');
}
});

module.exports = router;