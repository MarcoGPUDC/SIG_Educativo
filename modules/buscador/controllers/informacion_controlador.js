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

router.get('/obtenerDatosAdc', async (req, res) => {
  try {
      // Obtener todas las tareas utilizando el modelo de datos
      const data = await informacion.busqueda_adicional(req.query.num);
      res.send(data);
  } catch (error) {
      // Manejar cualquier error que ocurra durante la obtención de las tareas
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });

router.get('/obtenerDatosInfra', async (req, res) => {
  try {
      // Obtener todas las tareas utilizando el modelo de datos
      const data = await informacion.busqueda_adicional_infra(req.query.num);
      res.send(data);
  } catch (error) {
      // Manejar cualquier error que ocurra durante la obtención de las tareas
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });

  router.get('/obtenerDatosSedeAnexo', async (req,res) => {
    try {
      var anexo = req.query.anexo
      const data = await informacion.busqueda_adicional_sedeAnexo(req.query.cue);
      res.send([data, anexo]);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
    }
  });

module.exports = router;