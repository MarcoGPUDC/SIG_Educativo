//-------------------------------------ABM de INSTITUCIONES-------------------------------------------------------
const express = require('express');
const router = express.Router();
const buscador = require('../../buscador/models/buscador_model');
const consulta = require('../../../public/js/consulta_model');
const jwt = require('jsonwebtoken');

//obtiene clave
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
        req.user = payload;
        next()
      } else {
        return res.status(401).send('No cuenta con los permisos para continuar')
      }
  } catch (err) {
    return res.status(401).send('Token invalido o expirado')
  }
}

//Construir datos modificaciones
 function obtenerTablaDeColumna(columna, tablasPermitidas) {
  for (const tabla in tablasPermitidas) {
    if (tablasPermitidas[tabla].includes(columna)) {
      return tabla;
    }
  }
  return null; // No encontrada
}
function generarCambios(reqBody, tablasPermitidas, valoresAnteriores) {
  const cambios = [];

  for (const columna in reqBody) {

    // Ignorar campos que no son datos modificables
    if (columna === "id" || columna === "tipo_cambio" || columna ==="clave_primaria" || columna ==="estado" || columna ==="usuario" || columna ==="fecha_solicitud" || columna ==="fecha_revision" || columna ==="revisado_por" || columna ==="motivo_rechazo") continue;

    const tabla = obtenerTablaDeColumna(columna, tablasPermitidas);
    if (!tabla) continue; // Campo desconocido → ignorado
    cambios.push({
      tabla,
      columna,
      valor_anterior: valoresAnteriores[columna],
      valor_nuevo: reqBody[columna],
      id_registro: reqBody.id_registro
    });
    console.log(cambios)
  }

  return cambios;
}


//acceso a pestaña ABM, verifica permisos
router.get('/',verify, async (req, res) => {
  try {
    res.render('abmView');
  } catch (error) {
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});

router.get('/modificaciones', async (req, res) => {
  try {
    const data = await consulta.obtener_modificaciones();
    res.send(data);
  } catch (error) {
    console.error('Error al cargar las modificaciones', error);
    res.status(500).send('Error al optener las opciones.');
  }
});

//precarga los inputs con las instituciones diponibles
router.get('/cargaDatosABM', async (req, res) => {
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
  const dato_nuevo = req.body;
  try {
    // Recuperar token desde cookie
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "No autorizado" });

    // Validar token
    const payload = jwt.verify(token, SECRET_KEY);

    // Extraer usuario desde el token
    const usuario = payload.user;
    const dato_anterior ={institucion: "no exite"};
    const tipo_cambio = "crear"
    const clave_primaria = 0;
    const result = await consulta.solicitud_modificacion(
      dato_nuevo,
      usuario,          // ← usuario seguro del token, no del cliente
      tipo_cambio,
      dato_anterior,
      clave_primaria
    );
    res.status(201).json({ message: 'Solicitud de creacion realizada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

//Modifica en la base de datos (intitucion y oferta)
router.post('/update', async (req, res) => {
  try {
    // Recuperar token desde cookie
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "No autorizado" });

    // Validar token
    const payload = jwt.verify(token, SECRET_KEY);

    // Extraer usuario desde el token
    const usuario = payload.user;

    // Extraer datos enviados por el cliente
    const { dato_nuevo, tipo_cambio, clave_primaria } = req.body;

    
    // Mantener tu lógica actual
    const dato_anterior = await consulta.busqueda_simple(clave_primaria);
    const result = await consulta.solicitud_modificacion(
      dato_nuevo,
      usuario,          // ← usuario seguro del token, no del cliente
      tipo_cambio,
      dato_anterior,
      clave_primaria
    );

    res.status(201).json({ message: 'Institucion modificada', data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});


//Elimina la institucion de la base de datos (intitucion, georeferencia y oferta)
router.post('/delete', async (req, res) => {
  const id = req.query.id;
  const accion = req.query.accion;
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const payload = jwt.verify(token, SECRET_KEY);
    const usuario = payload.user;
    var dato_nuevo = {}
    if(accion == "baja"){
      dato_nuevo = {funcion: "Inactivo"};
    } else {
      dato_nuevo = {institucion: "eliminar"};
    }
    const dato_anterior = await consulta.busqueda_simple(id);
    const result = await consulta.solicitud_borrar(accion,id,dato_anterior,dato_nuevo,usuario);
    res.status(201).json({ message: 'Institucion borrada', data: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

router.post('/aprobarCambio', async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id)
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const payload = jwt.verify(token, SECRET_KEY);
    const usuario = payload.user;

    const tablasPermitidas = {
    institucion: ["id_institucion","departamento", "localidad", "numero", "cue","anexo","funcion","region","domicilio","cp","ambito","web","email_inst","nombre","tel","cue_anexo"],
    nivel:["nivel"],
    funcionamiento: ["jornada", "gestion", "dependencia"],
    modalidades_educativas:["modalidad"],

  };

    // Esto viene de tu BD
    const datos = await consulta.obtener_modificaciones_by_id(id);
    console.log(datos)
    console.log(datos[0].dato_nuevo)
    
    /*if (datos.tipo_cambio === "modificacion") {
        await consulta.aprobar_modificacion(datos, usuario);
    } else if (datos.tipo_cambio === "alta") {
        await consulta.aprobar_alta(datos, usuario);
    } else if (datos.tipo_cambio === "baja") {
        await consulta.aprobar_baja(datos, usuario);
    } else {
        return res.status(400).json({ error: "Tipo de cambio no válido" });
    }*/

    res.json({ message: "Cambio aprobado correctamente" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al aprobar cambio" });
  }
});

module.exports = router;