const express = require('express');
const router = express.Router();
const consultar = require('./public/js/consulta_model');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_EC_KEY;
const token = jwt.sign({ app: 'dashboard-etp' }, SECRET_KEY, {noTimestamp: true})

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
  
    if (!token) return res.status(401).send('Token requerido');
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).send('Token inválido');
      req.appData = decoded; // por si necesitás usarlo después
      next();
    });
  }

router.get('/getDataEtp',verificarToken, async (req, res) => {
  try {
      const data = await consultar.getDataEtp();
      res.send(data);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al obtener los datos.');
  }
  });

  module.exports = router;