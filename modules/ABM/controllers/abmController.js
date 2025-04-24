//-------------------------------------ABM de INSTITUCIONES-------------------------------------------------------
const express = require('express');
const router = express.Router();
const buscador = require('../../buscador/models/buscador_model');
const consulta = require('../../../public/js/consulta_model');
const autenticar = require('../../../login_controller')
const jwt = require('jsonwebtoken');


const SECRET_KEY = process.env.SECRET_KEY;

function verify(req, res, next){
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).send('No autorizado. Inicie sesión')
  }
  try {
     const payload = jwt.verify(token, SECRET_KEY);
      if(payload.role === 'admin' || payload.role === 'auditor'){
        req.user= payload;
        next()
      } else {
        return res.status(401).send('No cuenta con los permisos para continuar')
      }
  } catch (err) {
    return res.status(401).send('Token invalido o expirado')
  }
}

router.get('/',verify, async (req, res) => {
  try {
    res.render('abmView');
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

router.get('/obtenerDatos', async (req, res) => {
  try {
      // Obtener todas las tareas utilizando el modelo de datos
      const data = await consulta.busqueda_simple(req.query.id);
      res.send(data);
  } catch (error) {
      // Manejar cualquier error que ocurra durante la obtención de las tareas
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });


router.post('/insert', async (req, res) => {
  const {departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo, lat, long, modalidad, nivel} = req.body;
  try {
    const result = await consulta.crear_institucion(departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo);
    const setUbi = await consulta.cargar_ubicacion(result[0].id_institucion, lat, long);
    const serFunc = await consulta.cargar_oferta(result[0].id_institucion, modalidad, nivel);
    res.status(201).json({ message: 'Institucion creada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

router.post('/update', async (req, res) => {
  const {departamento, localidad, numero, region, domicilio, cp, ambito, web, email, nombre, tel, modalidad, nivel, id} = req.body;
  try {
    const result = await consulta.modificar_institucion(departamento, localidad, numero, region, domicilio, cp, ambito, web, email, nombre, tel, id);
    const serFunc = await consulta.modificar_oferta(id, nivel, modalidad);
    res.status(201).json({ message: 'Institucion modificada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});


router.post('/delete', async (req, res) => {
  const id = req.query.id; // Datos del cliente
  try {
    const result = await consulta.borrar_institucion(id);
    res.status(201).json({ message: 'Institucion borrada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

module.exports = router;