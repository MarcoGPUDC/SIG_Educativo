var express = require('express');
const cors = require('cors');
var app = express();
const path = require('path');
var raiz = 'http://sistemas.chubut.edu.ar/mapa/'
var https = require('https');
var fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('dotenv').config();
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'modules')));
app.use(express.static(path.join(__dirname,'modules','buscador')));
app.use(express.static(path.join(__dirname,'modules','mapa')));
app.use(express.static(path.join(__dirname,'modules','ABM')));
app.use(express.static(path.join(__dirname,'node_modules')));
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
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

app.use(cors());

app.use('/geoserver', createProxyMiddleware({
  target: 'http://localhost:8585/geoserver/',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error en el proxy:', err.message);
    res.status(500).send('Error al conectar con el servidor destino.');
},
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

app.use('/abm', express.static(path.join(__dirname, 'modules', 'ABM'), {
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
//rutas de donde servise de vistas
app.set('views', [__dirname + '/modules/buscador/views', __dirname + '/modules/ABM/views', __dirname + '/']);

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

app.get('/otro', function(req, res) {
  res.sendFile(__dirname + '/modules/mapa/index.html');
});

const informacion_controlador = require('./modules/buscador/controllers/informacion_controlador')
app.use('/info', informacion_controlador);

const buscador_controlador = require('./modules/buscador/controllers/buscador_controlador');
app.use('/buscador', buscador_controlador);

//DESCOMENTAR PARA HABILITAR LOG IN
/*const login_controlador = require('./login_controller');
app.use('/login', login_controlador);*/

const mapRoutes = require('./modules/mapa/models/info_popup_model');
app.use('/', mapRoutes);

const mapInfo = require('./modules/mapa/models/info_crear_layer');
app.use('/', mapInfo);

const filtroInfo = require('./modules/mapa/models/info_filtro');
app.use('/', filtroInfo);

const loginRoutes = require('./login_controller');
app.use('/auth', loginRoutes);


//RUTAS ABM DESCOMENTAR CUANDO SE HABILITE EL INICIO DE SESION
const servicios = require('./modules/ABM/controllers/services.js');
app.use('/abm', servicios);

const abmRoutes = require('./modules/ABM/controllers/abmController.js');
app.use('/abm', abmRoutes);

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

//ACCESO A MAPAS INTERACTIVOS


//ENDSPOINTS
app.post('/logout', (req, res) => {
  res.clearCookie('authToken',{
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return res.status(200).json({message:'Sesion cerrada'})
})

app.get("/getCookie", (req,res) => {
  const cookie = req.cookies.authToken || null
  res.json({cookie})
})

app.get('/config', (req,res) => {
  res.json({geoUser: process.env.USERNAME_GEO,
            geoPass: process.env.PASSWORD_GEO
  })
})

const apiRoutes = require('./apiController');
app.use('/api', apiRoutes);

// Iniciar el servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});