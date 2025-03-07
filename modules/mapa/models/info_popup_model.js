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

router.get('/mapa/setEquiInfraMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_equi_infra();
        const completitud = await consultar.buscar_porcentaje_equi_infra();
        // Verificar los datos obtenidos
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        
        result.forEach(row => {
            var estado = row.completitud
			switch (estado){
                case 0:
                case 1:
                case 2:    
				case 3:
						estado = 'critico'
					break;
                case 4:
				case 5:
						estado = 'bajo'
					break;
                case 6:
				case 7:
						estado = 'medio'
					break;
                case 8:
				case 9:
						estado = 'bueno'
					break;
				case 9:
						estado = 'excelente'
					break;
			}
            const geom = JSON.parse(row.geom);
            var newFeature = {
                type: "Feature",
                geometry: geom,
                properties: {
                    id: row.id,
                    cueanexo: row.cue_anexo,
                    nombre: row.nombre,
                    codjurid: row.numero,
                    localidad: row.localidad,
                    domicilio: row.domicilio,
                    web: row.web,
                    email:row.email,
                    nivel: row.nivel,
                    agua: row.agua,
                    internet: row.internet,
                    fuente_internet: row.fuente_internet,
                    energia: row.energia,
                    fuente_energia: row.fuente_energia,
                    calefaccion: row.calefaccion,
                    biblioteca: row.biblioteca,
                    laboratorio: row.laboratorio,
                    informatica: row.informatica,
                    artistica: row.artistica,
                    taller: row.taller,
                    region: row.region,
                    completitud: estado
                }
            };
           geoJSON.features.push(newFeature) 
        })
        res.json({
            geoJSON: {data: geoJSON},
            completitud:{data: completitud}

    });
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/mapa/cargarInfoRegiones', async (req, res) => {
    try {
        const region = req.query.region
        const result = await consultar.buscar_info_region(region);
        const datosRegion = [];
        // Verificar los datos obtenidos
        result.forEach(row => {
            var infoRegion = {
                    tipo: row.modalidad_nivel,
                    cantidad: row.cantidad
                }
            datosRegion.push(infoRegion)
            });
        res.json(datosRegion)
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

