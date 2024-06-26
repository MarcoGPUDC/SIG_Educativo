// Importar modulos necesarios
const express = require('express');
const router = express.Router();
const buscador = require('../models/buscador_model');
const informacion = require('../../../public/js/consulta_model');

router.get('/', async (req, res) => {
  try {
    res.render('searcher');
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});


router.get('/cargaDatos', async (req, res) => {
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

router.get('/datos', async (req, res) => {
  try {
    // Obtener todas las tareas utilizando el modelo de datos
    const data = await informacion.busqueda_simple_todo();
    res.send(data);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos.');
  }
});




module.exports = router;
