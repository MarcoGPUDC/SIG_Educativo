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
                    totallocal: row.totallocal,
                    primario: row.primario,
                    inicial: row.inicial,
                    secundario: row.secundario,
                    superior: row.superior,
                    formacion: row.formación,
                    poblacion: row.población,
                    superficie: row.superficie,
                    artistica: row.artística,
                    domhosp: row.domhosp,
                    epja: row.epja,
                    especial: row.especial,
                    oserveduc: row.oserveduc,
                    edificios: row.edificios,
                    sedes: row.sedes,
                    anexos: row.anexos
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
      const result = await consultar.buscar_ubicacion(localidad, departamento, region);
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

