const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const consulta = require('./public/js/consulta_model');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

router.get('/', async (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de las tareas
    console.error('Error al cargar el buscador', error);
    res.status(500).send('Error al optener las opciones.');
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const resultUser = await consulta.verificar_usuario_mysql(username);
    const resultRole = await consulta.verificar_rol(resultUser[0][0].id)
    bcrypt.compare(password, resultUser[0][0].encrypted_password, (err, result) => {
      if (err) {
          // Handle error
          console.error('Error comparing passwords:', err);
          return;
      }
  
    if (result) {
        const user = {id: resultUser[0][0].id,
                      role: resultRole.rol,
                      user: username
        }
        const token = jwt.sign(user, SECRET_KEY, {expiresIn: '1h'})
        res.cookie('authToken', token,{
          httpOnly: false,
          secure: false,
          sameSite: false,
          maxAge: 3600000
        })
        res.send(result)
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

/*router.post('/logout', async (req, res) => {
  res.clearCookie('authToken',{
    httpOnly: true,
    secure: false,
    sameSite: none
  });
  res.send('Sesion cerrada')
})*/

module.exports = router;