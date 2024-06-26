const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');

router.get('/mapa/ubicacion', async (req, res) => {
    try {
        const result = await consultar.buscar_ubicacion(req.query.id);

        // Verificar los datos obtenidos
        //console.log('Resultados obtenidos:', result);
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
        var coords = [result.long, result.lat];
        var newFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [coords[0], coords[1]]
            },
            properties: {
                id: result.id_institucion,
            }};
           geoJSON.features.push(newFeature) 
        res.json(geoJSON);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

