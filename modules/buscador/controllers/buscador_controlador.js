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

router.get('/oferta', async (req, res) => {
  try {
      var nivel = req.query.nivel;
      var modalidad = req.query.modalidad;
      var resultOfe;
      if (modalidad == 'todo' && nivel != 'todo'){
        resultOfe = await informacion.buscar_oferta_nivel(nivel);
      } else if (modalidad != 'todo' && nivel == 'todo'){
        resultOfe = await informacion.buscar_oferta_modalidad(modalidad);
      } else {
        resultOfe = await informacion.buscar_oferta(modalidad, nivel);
      }
      let geoJSON = {
      "type": "FeatureCollection",
      "features": [
      ]
      };
      resultOfe.forEach(result => {
        const geom = JSON.parse(result.geom);
        var newFeature = {
          type: "Feature",
          geometry: geom,
          properties: {
              id: result.id_institucion,
              numero: result.numero,
              nombre: result.nombre,
              nivel: result.nivel,
              modalidad: result.modalidad
          }};
      geoJSON.features.push(newFeature) 
      })
      res.json(geoJSON);
  } catch (error) {
    console.error('Error al obtener los datos: ', error);
    res.status(500).send('Error al obtener los datos.');
  }
})




module.exports = router;
