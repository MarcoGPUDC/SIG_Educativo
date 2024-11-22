var express = require('express');
var app = express();
const path = require('path');
var raiz = 'http://sistemas.chubut.edu.ar/mapa/'
var https = require('https');
var fs = require('fs');
const jwt = require('jsonwebtoken');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'modules')));
app.use(express.static(path.join(__dirname,'modules','buscador')));
app.use(express.static(path.join(__dirname,'modules','mapa')));
//app.use(express.static(path.join(__dirname,'modules','mapoteca')));
//app.use(express.static(path.join(__dirname,'modules','CRUD')));
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

app.use('/crud', express.static(path.join(__dirname, 'modules', 'CRUD'), {
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



// Configura Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', [__dirname + '/modules/buscador/views', __dirname + '/modules/CRUD/views']);
//app.set('views', path.join(__dirname, 'modules', 'buscador', 'views'));
//app.set('views', path.join(__dirname, 'modules', 'CRUD', 'views'));
//app.set('views', path.join(__dirname, 'modules', 'buscador'));

app.use('/login', express.static(path.join(__dirname), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/modules/mapa/index.html');
});

/*app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
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

const servicios = require('./modules/CRUD/controllers/services.js');
app.use('/crud/', servicios);

const crudRoutes = require('./modules/CRUD/controllers/crudController');
app.use('/crud', crudRoutes);

/*app.get('/login', (req, res) => {
    const token = req.query.token
    var secretKey = 'miClaveSecreta'
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }
        // Aquí puedes trabajar con los datos del token
        const userData = {
            userId: decoded.userId,
            roles: decoded.roles,
        };

        // Enviar la información relevante al frontend
        res.render('index',{user: userData });
    });
});*/



// Iniciar el servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
/*https.createServer(options, app).listen(port, () => {
    console.log(`Servidor HTTPS Express corriendo en puerto ${port}`)
});*/
