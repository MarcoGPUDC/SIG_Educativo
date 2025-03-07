const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');

router.get('/mapa/ubicacion', async (req, res) => {
    try {
        const result = await consultar.buscar_ubicacion(req.query.id);
        
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        const geom = JSON.parse(result.geom);
        var newFeature = {
            type: "Feature",
            geometry: geom,
            properties: {
                id: result.id_institucion,
                region: result.region,
                localidad: result.localidad,
                numero: result.numero,
                nombre: result.nombre,
                direccion: result.domicilio
            }};
           geoJSON.features.push(newFeature) 
        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/mapa/regiones', async (req, res) => {
    try {
        const result = await consultar.capa_regiones();
        const regiones = [];
        const recuentoR1 = await consultar.buscar_info_region("1");
        const recuentoR2 = await consultar.buscar_info_region("2");
        const recuentoR3 = await consultar.buscar_info_region("3");
        const recuentoR4 = await consultar.buscar_info_region("4");
        const recuentoR5 = await consultar.buscar_info_region("5");
        const recuentoR6 = await consultar.buscar_info_region("6");
        regiones.push(recuentoR1);
        regiones.push(recuentoR2);
        regiones.push(recuentoR3);
        regiones.push(recuentoR4);
        regiones.push(recuentoR5);
        regiones.push(recuentoR6);
        r = 0;
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        result.forEach(row => {
            const geom = JSON.parse(row.geom);
            multipolygon = geom.coordinates[0]
            var newFeature = {
                type: "Feature",
                geometry: geom,
                properties: {
                    id: row.id,
                    numreg: row.numreg,
                    nombrereg: row.nombrereg,
                    superficie: row.superficie,
                    cantidades: regiones[r]
                    }
            };
            r += 1;
            geoJSON.features.push(newFeature) 
        })
        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/mapa/departamentos', async (req, res) => {
    try {
        const result = await consultar.capa_departamentos();
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        result.forEach(row => {
            const geom = JSON.parse(row.geom);
            var newFeature = {
                type: "Feature",
                geometry: geom,
                properties: {
                    gid: row.gid,
                    nomdep: row.nomdep,
                    cabecera: row.cabecera,
                    superficie: row.superficie
                }
            };
           geoJSON.features.push(newFeature) 
        })
        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});



router.get('/mapa/capaprueba', async (req, res) => {
    try {
        const result = await consultar.capa_prueba();
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        result.forEach(row => {
            const geom = JSON.parse(row.geom);
            var newFeature = {
                type: "Feature",
                geometry: geom,
                properties: {
                    id: row.id,
                    nombre: row.nombre
                }
            };
           geoJSON.features.push(newFeature) 
        })
        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});



router.get("/mapa/localizar", async (req, res) => {
    try {
      var localidad = req.query.localidad;
      var departamento = req.query.departamento;
      var region = req.query.region;
      const result = await consultar.buscar_localizacion(localidad, departamento, region);
      let geoJSON = {
        "type": "FeatureCollection",
        "features": [
        ]
        };
      result.forEach(result => {
        const geom = JSON.parse(result.geom);
        var newFeature = {
          type: "Feature",
          geometry: geom,
          properties: {
              id: result.id_institucion,
              numero: result.numero,
              nombre: result.nombre,
              localidad: result.localidad,
              departamento: result.departamento,
              region: result.region,
              nivel: result.nivel,
              direccion: result.domicilio
          }};
      geoJSON.features.push(newFeature) 
      })
      res.json(geoJSON);
    } catch (error) {
      console.error('Error al obtener los datos: ', error);
      res.status(500).send('Error al obtener los datos.');
    }
  })





module.exports = router;

