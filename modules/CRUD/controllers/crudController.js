//-------------------------------------CRUD de INSTITUCIONES-------------------------------------------------------
const express = require('express');
const router = express.Router();
const buscador = require('../../buscador/models/buscador_model');
const consulta = require('../../../public/js/consulta_model');

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


router.post('/insert', async (req, res) => {
  const {departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo, lat, long} = req.body; // Datos del cliente
  try {
    //const values = [departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo];
    //console.log(values);
    const result = await consulta.crear_institucion(departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo);
    const setUbi = await consulta.cargar_ubicacion(result[0].id_institucion, lat, long);
    res.status(201).json({ message: 'Institucion creada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});



module.exports = router;