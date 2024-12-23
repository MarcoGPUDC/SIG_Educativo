const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');


router.get('/mapa/setInstMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_popup_inst();

        // Verificar los datos obtenidos
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
                    id: row.id_institucion,
                    cue_anexo: row.cue_anexo,
                    nombre: row.nombre,
                    numero: row.numero,
                    region: row.region,
                    localidad: row.localidad,
                    domicilio: row.domicilio,
                    nivel: row.nivel,
                    telefono: row.tel,
                    email: row.email,
                    sitioweb: row.web,
                    responsable: row.responsable,
                    tel_resp: row.tel_resp,
                    modalidad: row.modalidad,
                    funcion: row.funcion,
                    area: row.area
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

router.get('/mapa/areasInst', async (req, res) => {
    try {
        const result = await consultar.capa_areas();
        res.send(result);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/mapa/setSupervMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_supervision();

        // Verificar los datos obtenidos
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
                    nombrebibl: row.nombre,
                    direccion: row.domicilio,
                    numreg: row.region,
                    codpostal: row.cp,
                    localidad: row.localidad,
                    email: row.email,
                    horario: row.horario,
                    area: row.area
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

