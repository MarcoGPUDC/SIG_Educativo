const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');
const proj4 = require('proj4');

// Definir la proyección UTM correspondiente, por ejemplo, UTM zona 21S (ajusta según tu caso)
const utm21S = '+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs';
const wgs84 = proj4.WGS84;

router.get('/mapa/setInstMarkers', async (req, res) => {
    try {
        const result = await consultar.buscar_info_popup_inst();

        // Verificar los datos obtenidos
        console.log('Resultados obtenidos:', result.rows);

        const geoJSON = {
            type: "FeatureCollection",
            features: result.rows.map(row => {
                // Convertir coordenadas UTM a latitud/longitud
                const coords = proj4(utm21S, wgs84, [row.long, row.lat]);

                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [coords[0], coords[1]]
                    },
                    properties: {
                        id: row.id_institucion,
                        cueanexo: row.cue_anexo,
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
            })
        };

        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

