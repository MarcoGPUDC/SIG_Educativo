const consultar = require('../../../public/js/consulta_model');
//const conectarDB = require('../db_conexion');

// Establece la conexión a la base de datos
//const db = conectarDB();





/*function buscar_todos_numero () {
    return db.any('SELECT numero FROM padron.institucion ORDER BY numero ASC');
};

function buscar_todos_nombre () {
    return db.any('SELECT nombre FROM padron.institucion ORDER BY nombre ASC');
};

function buscar_todos_modalidad () {
    return db.any('SELECT nombre FROM padron.modalidades_educativas');
};

function buscar_por_cue () {
    return db.any('SELECT id_institucion FROM padron.institucion ORDER BY id_institucion ASC');
};

function buscar_todos_nivel () {
    return db.any('SELECT nombre FROM padron.nivel');
};

function buscar_todos_region () {
    return db.any('SELECT DISTINCT region FROM padron.institucion ORDER BY region asc;');
};

function buscar_todos_localidad () {
    return db.any('SELECT localidad FROM padron.localidad ORDER BY localidad asc;');
};

function buscar_todos_departamento () {
    return db.any('SELECT departamento FROM padron.departamento ORDER BY departamento asc;');
};

function buscar_todos_domicilio () {
    return db.any('SELECT domicilio FROM padron.institucion;');
};*/

async function datos_buscador () {
    let datos = [];

    // Consulta para obtener los números
    let consultaNumeros = consultar.buscar_todos_numero()
        .then(result => {
            datos.push({ clave: 'numero', valor: result }); // Agregar los números a la matriz de datos
        })
        .catch(error => {
            console.error('Error al consultar los números:', error);
        });

    // Consulta para obtener los nombres
    let consultaNombres = consultar.buscar_todos_nombre()
        .then(result => {
            datos.push({ clave: 'nombre', valor: result }); // Agregar los nombres a la matriz de datos
        })
        .catch(error => {
            console.error('Error al consultar los nombres:', error);
        });

    // Consulta para obtener las modalidades
    let consultaModalidad = consultar.buscar_todos_modalidad()
        .then(result => {
            datos.push({ clave: 'modalidad', valor: result }); // Agregar las modalidades a la matriz de datos
        })
        .catch(error => {
            console.error('Error al consultar las modalidades:', error);
        });


    let consultaNivel = consultar.buscar_todos_nivel()
    .then(result => {
        datos.push({ clave: 'nivel', valor: result }); // Agregar los niveles a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las modalidades:', error);
    });

    let consultaLocalidad = consultar.buscar_todos_localidad()
    .then(result => {
        datos.push({ clave: 'localidad', valor: result }); // Agregar las localidades a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las localidades:', error);
    });

    let consultaDepartamento = consultar.buscar_todos_departamento()
    .then(result => {
        datos.push({ clave: 'departamento', valor: result }); // Agregar los departamentos a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar los departamentos:', error);
    });

    let consultaDomicilio = consultar.buscar_todos_domicilio()
    .then(result => {
        datos.push({ clave: 'domicilio', valor: result }); // Agregar las direcciones a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las direcciones:', error);
    });

    let consultaAmbito = consultar.buscar_todos_ambito()
    .then(result => {
        datos.push({ clave: 'ambito', valor: result }); // Agregar las direcciones a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las direcciones:', error);
    });

    let consultaId = consultar.buscar_todos_id()
    .then(result => {
        datos.push({ clave: 'id', valor: result }); // Agregar las direcciones a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las direcciones:', error);
    });

    let consultaCueanexo = consultar.buscar_todos_cueanexo()
    .then(result => {
        datos.push({ clave: 'cueanexo', valor: result }); // Agregar las direcciones a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las direcciones:', error);
    });

    /*let consultaRegion = buscar_todos_region()
    .then(result => {
        datos.push({ clave: 'region', valor: result }); // Agregar las modalidades a la matriz de datos
    })
    .catch(error => {
        console.error('Error al consultar las modalidades:', error);
    });*/

    // Esperar a que ambas consultas se completen y luego retornar los datos
    return Promise.all([consultaNumeros, consultaNombres, consultaModalidad, consultaNivel, consultaLocalidad, consultaDomicilio, consultaDepartamento, consultaAmbito, consultaId, consultaCueanexo])
        .then(() => {
            return datos; // Retornar los datos una vez que ambas consultas se hayan completado
        });
};

module.exports = {
    datos_buscador
};