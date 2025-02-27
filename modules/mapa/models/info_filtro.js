const express = require('express');
const router = express.Router();
const consultar = require('../../../public/js/consulta_model');


function construirTabla(data){
    let htmlTable = '<table border="1"><tr>';
        
    if (data.length > 0) {
        // Crear los encabezados de la tabla
        Object.keys(data[0]).forEach(column => {
            htmlTable += `<th>${column}</th>`;
        });
        htmlTable += '</tr>';
        
        // Crear las filas de la tabla
        data.forEach(row => {
            htmlTable += '<tr>';
            Object.values(row).forEach(value => {
                htmlTable += `<td>${value}</td>`;
            });
            htmlTable += '</tr>';
        });
    }
    htmlTable += '</table>';
}

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
            case "matricula":
                    switch (col) {
                        case "ambito":
                            result = await consultar.filtro_matricula_ambito();
                            break;
                        case "gestion":
                            result = await consultar.filtro_matricula_gestion();
                            break;
                    default:
                        //result = result?construirTabla(result):"Sin datos"
                        break;
                    }
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

