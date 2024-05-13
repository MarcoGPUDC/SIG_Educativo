var express = require('express');
var app = express();
const path = require('path');
app.use(express.static(path.join(__dirname,'modules','mapa')));
app.use(express.static(path.join(__dirname,'modules','buscador')));


// Configura Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'modules', 'buscador', 'views'));
//app.set('views', path.join(__dirname, 'modules', 'buscador'));



app.get('/', function(req, res) {
  res.send('Hola Mundo');
});

app.get('/mapa', function(req, res) {
    res.sendFile(__dirname + '/modules/mapa/index.html');
});


const informacion_controlador = require('./modules/buscador/controllers/informacion_controlador')
app.use('/info', informacion_controlador);

const buscador_controlador = require('./modules/buscador/controllers/buscador_controlador');
app.use('/buscador', buscador_controlador);




// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
