var express = require('express');
var app = express();
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'modules','mapa')));
app.use(express.static(path.join(__dirname,'modules','buscador')));
app.use(express.static(path.join(__dirname,'modules','mapoteca')));
// Middleware para servir archivos estáticos con tipo MIME correcto
app.use('/modules/buscador', express.static(path.join(__dirname, 'modules/buscador'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/mapoteca', express.static(path.join(__dirname, 'modules','mapoteca'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));


// Configura Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'modules', 'buscador', 'views'));
//app.set('views', path.join(__dirname, 'modules', 'buscador'));



app.get('/inicio', function(req, res) {
  res.send('Hola Mundo');
});

app.get('/mapa', function(req, res) {
    res.sendFile(__dirname + '/modules/mapa/index.html');
});

app.get('/mapoteca', function(req, res){
  res.sendFile(__dirname + '/modules/mapoteca/views/mapoteca_index.html')
});


const informacion_controlador = require('./modules/buscador/controllers/informacion_controlador')
app.use('/info', informacion_controlador);

const buscador_controlador = require('./modules/buscador/controllers/buscador_controlador');
app.use('/buscador', buscador_controlador);

const mapRoutes = require('./modules/mapa/models/info_popup_model');
app.use('/', mapRoutes);



// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
