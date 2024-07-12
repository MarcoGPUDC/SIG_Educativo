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
        var coords = [result.long, result.lat];
        var newFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [coords[0], coords[1]]
            },
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



module.exports = router;

