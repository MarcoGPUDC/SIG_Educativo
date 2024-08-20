const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');

router.get('/mapa/cargarFiltro', async (req, res) => {
    try {
        const result = await consultar.buscar_info_filtro();
        res.send(result);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/mapa/filtrar', async (req, res) => {
    try {
        const dato = req.query.dato;
        const col = req.query.col;
        var result;
        switch (dato) {
            case "establecimiento":
                    switch (col) {
                        case "ambito":
                            result = await consultar.filtro_establecimiento_ambito();
                            break;
                        case "gestion":
                            result = await consultar.filtro_establecimiento_gestion();
                            break;
                        default:
                            break;
                    }
                break;
        
            default:
                break;
        }
        res.send(result);
    } catch (err) {
        console.error('Error al obtener los datos', err);
        res.status(500).json({ error: 'Database error' });
    }
});



module.exports = router;

