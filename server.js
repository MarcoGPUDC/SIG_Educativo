var express = require('express');
var app = express();
const path = require('path');
var raiz = 'http://sistemas.chubut.edu.ar/mapa/'
var https = require('https');
var fs = require('fs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'modules','mapa')));
app.use(express.static(path.join(__dirname,'modules','buscador')));
app.use(express.static(path.join(__dirname,'modules','mapoteca')));
app.use(express.static(path.join(__dirname,'node_modules')));
const { createProxyMiddleware } = require('http-proxy-middleware');
const keyPath = path.join(__dirname, 'server.key');
const certPath = path.join(__dirname, 'server.cert');
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
}
// Middleware para servir archivos estáticos con tipo MIME correcto
app.use('/modules/buscador', express.static(path.join(__dirname, 'modules/buscador'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/geoserver', createProxyMiddleware({
  target: 'http://localhost:8585/geoserver/',
  changeOrigin: true
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
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
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

/*
app.get('/mapoteca', function(req, res){
  res.sendFile(__dirname + '/modules/mapoteca/views/mapoteca_index.html')
});*/


const informacion_controlador = require('./modules/buscador/controllers/informacion_controlador')
app.use('/info', informacion_controlador);

const buscador_controlador = require('./modules/buscador/controllers/buscador_controlador');
app.use('/buscador', buscador_controlador);

const mapRoutes = require('./modules/mapa/models/info_popup_model');
app.use('/', mapRoutes);

const mapInfo = require('./modules/mapa/models/info_crear_layer');
app.use('/', mapInfo);

const filtroInfo = require('./modules/mapa/models/info_filtro');
app.use('/', filtroInfo);


// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
/*https.createServer(options, app).listen(port, () => {
    console.log(`Servidor HTTPS Express corriendo en puerto ${port}`)
});*/
