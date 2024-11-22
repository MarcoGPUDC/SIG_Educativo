//-------------------------------------CRUD de INSTITUCIONES-------------------------------------------------------
const express = require('express');
const router = express.Router();
const buscador = require('../../buscador/models/buscador_model');


router.get('/', async (req, res) => {
  try {
    res.render('crudView');
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});

router.get('/cargaDatosCrud', async (req, res) => {
  try {
    // Obtener todas las tareas utilizando el modelo de datos
    const data = await buscador.datos_buscador();
    res.send(data);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al obtener los CUEs:', error);
    res.status(500).send('Error al obtener los CUEs.');
  }
});

module.exports = router;