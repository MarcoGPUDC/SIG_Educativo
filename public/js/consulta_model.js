const conectarDB = require('../../modules/buscador/db_conexion');

// Establece la conexión a la base de datos
const db = conectarDB();

//busqueda de todos los elementos de cada campo del buscador
function buscar_todos_numero () {
    return db.any('SELECT DISTINCT numero FROM padron.institucion ORDER BY numero ASC');
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

function busqueda_simple_todo () {
    return db.any(`SELECT inst.*, COALESCE(c.responsable, 'Sin Informacion') AS responsable, COALESCE(c.email, 'Sin Informacion') AS email, COALESCE(c.tel_resp, 000000000) AS tel_resp FROM padron.v_institucion_completa AS inst
        JOIN padron.contacto c ON c.id_institucion = inst.cue;`);
};

function buscar_ubicacion(id) {
    return db.one (`SELECT inst.id_institucion, geo.lat, geo.long FROM padron.institucion inst JOIN padron.georeferencia geo ON geo.id_institucion = inst.id_institucion WHERE inst.id_institucion = $1;`, id)
}

//consultas especificas con inyeccion

function busqueda_simple (id) {
    return db.one(`SELECT inst.*, COALESCE(c.responsable, 'Sin Informacion') AS responsable, COALESCE(c.email, 'Sin Informacion') AS email, COALESCE(c.tel_resp, 000000000) AS tel_resp FROM padron.v_institucion_completa AS inst
        JOIN padron.contacto c ON c.id_institucion = inst.cue
        WHERE inst.cue = $1;`,id);
};

function busqueda_adicional (id) {
    return db.any(`SELECT inst.id_institucion, inst.cue_anexo, func.jornada, turno.nombre AS turno, nivel.nombre AS nivel, mod.nombre AS modalidad FROM padron.institucion inst 
    JOIN padron.funcionamiento func ON inst.id_institucion = func.id_institucion
    JOIN padron.turno turno ON turno.id_turno = func.id_turno
    JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
    JOIN padron.modalidades_educativas mod ON mod.id_modalidad = ofe.id_modalidad
    JOIN padron.nivel nivel ON ofe.id_nivel = nivel.id_nivel WHERE inst.id_institucion = $1;`,id);
};

//consultas para visualizar en el mapa
function buscar_info_popup_inst() {
    return db.any(`SELECT * FROM (SELECT inst.cue_anexo, (CASE WHEN inst.numero = 'Z000023' THEN 700 WHEN inst.numero = 'Z000024' THEN 700 WHEN inst.numero = 'CEF' THEN 700 WHEN inst.numero > '0' THEN inst.numero::INT END) AS numero, inst.nombre, inst.region, loc.localidad, inst.domicilio, inst.tel, cont.email, inst.web, cont.responsable, cont.tel_resp, niv.nombre AS nivel, geo.lat, geo.long, inst.id_institucion 
    FROM padron.institucion inst 
    JOIN padron.localidad loc ON inst.id_localidad = loc.id_localidad 
    JOIN padron.contacto cont ON inst.id_institucion = cont.id_institucion
    JOIN padron.georeferencia geo ON inst.id_institucion = geo.id_institucion
	JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
	JOIN padron.nivel niv ON ofe.id_nivel = niv.id_nivel) tmp ORDER BY numero;`);
};

function buscar_info_supervision() {
    return db.any(`SELECT suvision.id_supervision, suvision.nombre_sup, suvision.domicilio, suvision.tel, suvision.email, suvision.gestion, suvision.region, niv.nombre AS nivel, suvision.lat, suvision.long FROM padron.supervision suvision 
    JOIN padron.nivel niv ON suvision.id_nivel = niv.id_nivel`)
}

function buscar_info_delegacion(){
    return db.any(`SELECT del.id_delegacion, del.region, del.direccion, del.email, del.nombre, del.tel, del.delegado, del.long, del.lat, loc.localidad
        FROM padron.delegacion del JOIN padron.localidad loc ON del.id_localidad = loc.id_localidad`)
}


module.exports = {
    buscar_todos_numero,
    buscar_todos_nombre,
    buscar_todos_modalidad,
    buscar_todos_nivel,
    buscar_todos_region,
    buscar_todos_localidad,
    buscar_todos_departamento,
    buscar_todos_domicilio,
    busqueda_simple,
    buscar_info_popup_inst,
    busqueda_adicional,
    buscar_info_supervision,
    buscar_info_delegacion,
    busqueda_simple_todo,
    buscar_ubicacion
};