const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const consulta = require('./public/js/consulta_model');

router.get('/', async (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});


router.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await consulta.verificar_usuario(username);
    bcrypt.compare(password, result[0].contra, (err, result) => {
      if (err) {
          // Handle error
          console.error('Error comparing passwords:', err);
          return;
      }
  
    if (result) {
        // Passwords match, authentication successful
        res.status(200).json({ message: 'Usuario autenticado', data: result });
    } else {
        // Passwords don't match, authentication failed
        res.status(200).json({ message: 'Usuario no autenticado', data: result });
    }
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

router.post('/createUser', async (req, res) => {
  try {
    const { email, contra, nombre, apellido, rol } = req.body;
    const saltRounds = 10;
    let passC = bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
          return;
      }
      return bcrypt.hash(contra, salt, (err, hash) => {
          if (err) {
              return;
          }
          return hash;
      })
      });
    const result = await consulta.registrar_usuario(rol, nombre, apellido, email, passC);
    res.status(201).json({message: 'Usuario creado correctamente'})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

module.exports = router;