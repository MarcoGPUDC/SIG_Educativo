//-------------------------------------ABM de INSTITUCIONES-------------------------------------------------------
const express = require('express');
const router = express.Router();
const buscador = require('../../buscador/models/buscador_model');
const consulta = require('../../../public/js/consulta_model');
const autenticar = require('../../../login_controller')
const jwt = require('jsonwebtoken');

//obtiene clave desde archivo ".env"
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar el token de autenticación
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

//acceso a pestaña AMB, verifica permisos
router.get('/',verify, async (req, res) => {
  try {
    res.render('abmView');
  } catch (error) {
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});

//precarga los inputs con las instituciones diponibles
router.get('/cargaDatosCrud', async (req, res) => {
  try {
    // Obtener todas las opciones utilizando
    const data = await buscador.datos_buscador();
    res.send(data);
  } catch (error) {
    console.error('Error al obtener los CUEs:', error);
    res.status(500).send('Error al obtener los CUEs.');
  }
});

//busca los datos de una institucion
router.get('/obtenerDatos', async (req, res) => {
  try {
      const data = await consulta.busqueda_simple(req.query.id);
      res.send(data);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });

//Insertar en la base de datos (intitucion, georeferencia y oferta)
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

//Modifica en la base de datos (intitucion y oferta)
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

//Elimina la institucion de la base de datos (intitucion, georeferencia y oferta)
router.post('/delete', async (req, res) => {
  const id = req.query.id;
  try {
    const result = await consulta.borrar_institucion(id);
    res.status(201).json({ message: 'Institucion borrada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

module.exports = router;