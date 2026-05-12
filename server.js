var express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')
var app = express();
const path = require('path');
var https = require('https');
var fs = require('fs');
var RateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session');
const lusca = require('lusca').csrf;
const { createProxyMiddleware } = require('http-proxy-middleware');
app.set('trust proxy', 1);
require('dotenv').config();
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'modules')));
app.use(express.static(path.join(__dirname,'modules','buscador')));
app.use(express.static(path.join(__dirname,'modules','mapa')));
app.use(express.static(path.join(__dirname,'modules','ABM')));
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
const keyPath = path.join(__dirname, 'server.key');
const certPath = path.join(__dirname, 'server.cert');
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};



// set up rate limiter: maximum of five requests per minute
var limiter = RateLimit({
  windowMs: 40 * 60 * 1000, // 15 minutes
  max: 1000, // max 500 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

//generar sesion para usuario no logueado
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));

app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));


app.use(
    '/geoserver',
    createProxyMiddleware({
        target: process.env.GEOSERVER_URL,
        changeOrigin: true
    })
);

// Middleware para servir archivos estáticos con tipo MIME correcto
app.use('/modules/buscador', express.static(path.join(__dirname, 'modules/buscador'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(cors());


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

app.use('/dibujarmapa', express.static(path.join(__dirname, 'modules', 'dibujador'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Configura Pug como motor de plantillas
app.set('view engine', 'pug');
//rutas de donde servise de vistas
app.set('views', [__dirname + '/modules/buscador/views', __dirname + '/modules/ABM/views', __dirname + '/', __dirname + '/modules/dibujador/views', __dirname + '/public/complementos']);

app.locals.basedir = path.join(__dirname, 'public', 'complementos');

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

const mapRoutes = require('./modules/mapa/models/info_popup_model');
app.use('/', mapRoutes);

const mapInfo = require('./modules/mapa/models/info_crear_layer');
app.use('/', mapInfo);

const filtroInfo = require('./modules/mapa/models/info_filtro');
app.use('/', filtroInfo);

const loginRoutes = require('./login_controller');
app.use('/auth', loginRoutes);

const dibujoRoutes = require('./modules/dibujador/controllers/dibujoControlador.js');
app.use('/dibujarmapa', dibujoRoutes);



//RUTAS ABM DESCOMENTAR CUANDO SE HABILITE EL INICIO DE SESION
const servicios = require('./modules/ABM/controllers/services.js');
app.use('/abmservices', servicios);

const abmRoutes = require('./modules/ABM/controllers/abmController.js');
app.use('/abm', abmRoutes);


//RUTAS GLOBALES
app.get('/session-info', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.json({
      loggedIn: false,
      user: null,
      role: null
    });
  }

  try {
    // Verifica token
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    return res.json({
      loggedIn: true,
      user: payload.user,
      role: payload.role
    });

  } catch (err) {
    return res.json({
      loggedIn: false,
      user: null,
      role: null
    });
  }
});

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//ACCESO A MAPAS INTERACTIVOS

//PROXYS
app.get('/proxyimg', async (req, res) => {

  try {

    const { url } = req.query;

    // Hosts permitidos
    const allowedHosts = [
      'drive.google.com',
      'googleusercontent.com',
      'drive.usercontent.google.com'
    ];

    // Validar parámetro
    if (!url) {
      return res.status(400).send(
        'Falta el parámetro "url"'
      );
    }

    // Parsear URL
    const parsed = new URL(url);

    const host = parsed.hostname;

    // Validar host
    const isAllowed = allowedHosts.some(
      allowed => host.endsWith(allowed)
    );

    if (!isAllowed) {
      return res.status(403).send(
        'URL no permitida'
      );
    }

    // =========================
    // CORRECCIÓN GOOGLE DRIVE
    // =========================

    // Extraer ID del archivo
    const fileId =
      parsed.searchParams.get('id');

    // URL final
    let finalUrl = url;

    // Convertir URLs /uc?export=view
    // a thumbnail directa
    if (fileId) {

      finalUrl =
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    console.log('Proxy IMG:', finalUrl);

    // Descargar imagen
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log(
      'Status IMG:',
      response.status
    );

    if (!response.ok) {

      return res.status(502).send(
        'Error al obtener la imagen'
      );
    }

    // Tipo de contenido
    const contentType =
      response.headers.get('content-type')
      || 'image/jpeg';

    console.log(
      'Content-Type:',
      contentType
    );

    // Validar imagen real
    if (!contentType.startsWith('image/')) {

      console.error(
        'La URL no devolvió una imagen válida'
      );

      return res.status(502).send(
        'Contenido inválido'
      );
    }

    // Descargar buffer
    const buffer =
      await response.arrayBuffer();

    // Headers
    res.setHeader(
      'Content-Type',
      contentType
    );

    res.setHeader(
      'Cache-Control',
      'public, max-age=86400'
    );

    // Enviar imagen
    return res.send(
      Buffer.from(buffer)
    );

  } catch (error) {

    console.error(
      'Error en proxy:',
      error
    );

    return res.status(500).send(
      'Error interno del servidor'
    );
  }
});

//ENDSPOINTS
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: 'lax',
      path: '/'
    });
    res.status(200).json({ message: 'Sesion cerrada' });
  });
});

app.get("/getCookie", (req,res) => {
  const cookie = req.cookies.authToken || null
  res.json({cookie})
})

const apiRoutes = require('./apiController');
app.use('/api', apiRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});