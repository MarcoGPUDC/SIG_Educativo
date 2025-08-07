const express = require('express');
const router = express.Router();
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
      if(payload.role === 'admin' || payload.role === 'auditor' || payload.role === 'tecsig'){
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
      res.render('dibujo');
    } catch (error) {
      console.error('Error al cargar la pagina de dibujo', error);
      res.status(500).send('Error al optener las opciones.');
    }
  });

module.exports = router;