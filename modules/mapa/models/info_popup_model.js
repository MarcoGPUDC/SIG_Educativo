const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');
const proj4 = require('proj4');

// Definir la proyección UTM correspondiente, por ejemplo, UTM zona 21S (ajusta según tu caso)
//const utm21S = '+proj=utm +zone=19 +south +datum=UTM +units=m +no_defs';
//const wgs84 = proj4.WGS84;

router.get('/mapa/setInstMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_popup_inst();

        // Verificar los datos obtenidos
        //console.log('Resultados obtenidos:', result);
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        
        result.forEach(row => {
            var coords = [row.long, row.lat];
            var newFeature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coords[0], coords[1]]
                },
                properties: {
                    id: row.id_institucion,
                    cueanexo: row.cue_anexo,
                    nombre: row.nombre,
                    numero: row.numero,
                    region: row.region,
                    localidad: row.localidad,
                    direccion: row.domicilio,
                    nivel: row.nivel,
                    telefono: row.tel,
                    email: row.email,
                    sitioweb: row.web,
                    responsable: row.responsable,
                    tel_resp: row.tel_resp
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

router.get('/mapa/setSupervMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_supervision();

        // Verificar los datos obtenidos
        //console.log('Resultados obtenidos:', result);
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        
        result.forEach(row => {
            var coords = [row.long, row.lat];
            var newFeature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coords[0], coords[1]]
                },
                properties: {
                    id: row.id_supervision,
                    nombre_sup: row.nombre_sup,
                    direccion: row.domicilio,
                    region: row.region,
                    nivel: row.nivel,
                    telefono: row.tel,
                    email: row.email,
                    responsable: row.supervisor,
                    gestion: row.gestion
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

router.get('/mapa/setDelegMarkers', async (req,res) => {
    try {
        const result = await consultar.buscar_info_delegacion();

        // Verificar los datos obtenidos
        //console.log('Resultados obtenidos:', result);
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        
        result.forEach(row => {
            var coords = [row.long, row.lat];
            var newFeature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coords[0], coords[1]]
                },
                properties: {
                    id: row.id_delegacion,
                    nombre: row.nombre,
                    direccion: row.direccion,
                    region: row.region,
                    localidad: row.localidad,
                    tel: row.tel,
                    email: row.email,
                    responsable: row.delegado
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

router.get('/mapa/setBiblioMarkers', async (req,res) => {
    try {
        const result = await consultar.buscar_todos_biblioteca();

        // Verificar los datos obtenidos
        //console.log('Resultados obtenidos:', result);
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        
        result.forEach(row => {
            var coords = [row.long, row.lat];
            var newFeature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coords[0], coords[1]]
                },
                properties: {
                    id: row.id_biblioteca,
                    nombre: row.nombre,
                    direccion: row.domicilio,
                    region: row.region,
                    cp: row.cp,
                    localidad: row.localidad,
                    email: row.email,
                    horario: row.horario
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

module.exports = router;

