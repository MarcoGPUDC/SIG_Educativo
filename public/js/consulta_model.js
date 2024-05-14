const conectarDB = require('../../modules/buscador/db_conexion');

// Establece la conexión a la base de datos
const db = conectarDB();

//busqueda de todos los elementos de cada campo del buscador
function buscar_todos_numero () {
    return db.any('SELECT id_institucion AS id, numero FROM padron.institucion ORDER BY numero ASC');
};

function buscar_todos_nombre () {
    return db.any('SELECT id_institucion AS id, nombre FROM padron.institucion ORDER BY nombre ASC');
};

function buscar_todos_modalidad () {
    return db.any('SELECT id_modalidad AS id, nombre AS modalidad FROM padron.modalidades_educativas');
};

function buscar_todos_nivel () {
    return db.any('SELECT id_nivel AS id, nombre AS nivel FROM padron.nivel');
};

function buscar_todos_region () {
    return db.any('SELECT DISTINCT id_institucion, region FROM padron.institucion ORDER BY region asc;');
};

function buscar_todos_localidad () {
    return db.any('SELECT id_localidad AS id, localidad FROM padron.localidad ORDER BY localidad asc;');
};

function buscar_todos_departamento () {
    return db.any('SELECT id_departamento AS id, departamento FROM padron.departamento ORDER BY departamento asc;');
};

function buscar_todos_domicilio () {
    return db.any('SELECT id_institucion AS id, domicilio FROM padron.institucion;');
};

//consultas especificas con inyeccion

function busqueda_simple (id) {
    return db.one(`SELECT inst.*, COALESCE(c.responsable, 'Sin Informacion') AS responsable, COALESCE(c.email, 'Sin Informacion') AS email, COALESCE(c.tel_resp, 000000000) AS tel_resp FROM padron.v_institucion_completa AS inst
    JOIN padron.contacto c ON c.id_institucion = inst.cue
    WHERE inst.cue = $1;`,id);
};


module.exports = {
    buscar_todos_numero,
    buscar_todos_nombre,
    buscar_todos_modalidad,
    buscar_todos_nivel,
    buscar_todos_region,
    buscar_todos_localidad,
    buscar_todos_departamento,
    buscar_todos_domicilio,
    busqueda_simple
};