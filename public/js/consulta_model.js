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
    return db.any(`SELECT inst.*, COALESCE(inst.responsable, 'Sin Informacion') AS responsable, COALESCE(inst.tel, 'Sin Informacion') AS tel_resp, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM padron.v_establec_educativos AS inst`);
};

function buscar_ubicacion(id) {
    return db.one (`SELECT inst.id_institucion, inst.nombre, inst.numero, inst.domicilio, loc.localidad, inst.region, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM padron.institucion inst JOIN padron.georeferencia geo ON geo.id_institucion = inst.id_institucion JOIN padron.localidad loc ON loc.id_localidad = inst.id_localidad WHERE inst.id_institucion = $1;`, id)
}

function buscar_todos_biblioteca() {
    return db.any (`SELECT bi.id_biblioteca, bi.nombre, bi.domicilio, bi.cp, loc.localidad, bi.email, bi.horario, bi.region, bi.long, bi.lat, ST_area(rad.geom) AS area FROM padron.biblioteca bi 
                    JOIN padron.localidad loc ON loc.id_localidad = bi.id_localidad
                    JOIN public.radio_bibliotecas rad ON rad.numbibl = bi.id_biblioteca`)
}
function area_bibliotecas() {
    return db.any ('SELECT numbibl, ST_Area(abib.geom)  FROM radio_bibliotecas abib');
}

//consultas especificas con inyeccion

//busca info especifica de un establecimiento por su id
function busqueda_simple (id) {
    return db.one(`SELECT inst.*, COALESCE(inst.responsable, 'Sin Informacion') AS responsable, COALESCE(inst.tel, 'Sin Informacion') AS tel_resp, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM padron.v_establec_educativos AS inst WHERE inst.id_institucion = $1;`,id);
};
//busca info adicional de un establecimiento por su id
function busqueda_adicional (id) {
    return db.any(`SELECT inst.id_institucion, inst.cue_anexo, func.jornada, turno.nombre AS turno, nivel.nombre AS nivel, mod.nombre AS modalidad FROM padron.institucion inst 
    LEFT JOIN padron.funcionamiento func ON inst.id_institucion = func.id_institucion
    LEFT JOIN padron.turno turno ON turno.id_turno = func.id_turno
    JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
    LEFT JOIN padron.modalidades_educativas mod ON mod.id_modalidad = ofe.id_modalidad
    LEFT JOIN padron.nivel nivel ON ofe.id_nivel = nivel.id_nivel WHERE inst.id_institucion = $1;`,id);
};

//consultas para visualizar en el mapa
//info para anexar al popup de las instituciones
function buscar_info_popup_inst() {
    return db.any(`SELECT * FROM (SELECT inst.cue_anexo, (CASE WHEN inst.numero = 'Z000023' THEN 700 WHEN inst.numero = 'Z000024' THEN 700 WHEN inst.numero = 'CEF' THEN 700 WHEN inst.numero > '0' THEN inst.numero::INT END) AS numero, inst.nombre, inst.region, loc.localidad, inst.domicilio, inst.tel, cont.email, inst.web, cont.responsable, cont.tel_resp, niv.nombre AS nivel, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom, inst.id_institucion, moda.nombre AS modalidad
    FROM padron.institucion inst 
    JOIN padron.localidad loc ON inst.id_localidad = loc.id_localidad 
    JOIN padron.contacto cont ON inst.id_institucion = cont.id_institucion
    JOIN padron.georeferencia geo ON inst.id_institucion = geo.id_institucion
	JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
	JOIN padron.nivel niv ON ofe.id_nivel = niv.id_nivel
    JOIN padron.modalidades_educativas moda ON moda.id_modalidad = ofe.id_modalidad
    WHERE inst.funcion = 'Activo') tmp
    GROUP BY tmp.nivel, tmp.cue_anexo, tmp.numero, tmp.nombre, tmp.region, tmp.localidad, tmp.domicilio, tmp.tel, tmp.email, tmp.web, tmp.responsable, tmp.tel_resp, tmp.geom, tmp.id_institucion, tmp.modalidad
    ORDER BY numero`);
};
//info para anexar al popup de las supervisiones
function buscar_info_supervision() {
    return db.any(`SELECT suvision.id_supervision, suvision.nombre_sup, suvision.domicilio, suvision.tel, suvision.email, suvision.gestion, suvision.region, niv.nombre AS nivel, suvision.lat, suvision.long FROM padron.supervision suvision 
    JOIN padron.nivel niv ON suvision.id_nivel = niv.id_nivel`)
}

//info para anexar al popup de las delegaciones
function buscar_info_delegacion(){
    return db.any(`SELECT del.id_delegacion, del.region, del.direccion, del.email, del.nombre, del.tel, del.delegado, del.long, del.lat, loc.localidad
        FROM padron.delegacion del JOIN padron.localidad loc ON del.id_localidad = loc.id_localidad`)
}

//funcion para buscar por oferta educativa
function buscar_oferta(modalidad, nivel) {
    return db.any(`SELECT inst.id_institucion, inst.nombre, inst.numero, niv.nombre AS nivel, moda.nombre AS modalidad, geo.long, geo.lat FROM padron.institucion inst JOIN padron.oferta ofe ON inst.id_institucion = ofe.id_institucion
        JOIN padron.modalidades_educativas moda ON moda.id_modalidad = ofe.id_modalidad
        JOIN padron.georeferencia geo ON inst.id_institucion = geo.id_institucion
        JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel WHERE niv.nombre = $1 AND moda.nombre = $2`, [nivel, modalidad])
}
//busquedas para el filtro
function buscar_info_filtro(){
    return db.any(`SELECT 'Región ' || inst.region AS Región, inst.ambito, inst.numero, COALESCE(mat.varones, 0) AS masculino, COALESCE(mat.mujeres, 0) AS femenino, COALESCE(mat.no_binario, 0) AS no_binario, func.gestion, niv.nombre AS nivel FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
		JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
		ORDER BY inst.numero`)
}

function filtro_establecimiento_gestion() {
    return db.any(`SELECT 'Región ' || inst.region AS Región, COUNT(CASE WHEN func.gestion = 'Estatal' THEN 1 ELSE NULL END) AS Estatal, COUNT(CASE WHEN func.gestion = 'Privado' THEN 1 ELSE NULL END) AS Privada, COUNT(CASE WHEN func.gestion = 'Gestión social/cooperativa' THEN 1 ELSE NULL END) AS Social_Cooperativa FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
		JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
		GROUP BY inst.region
		ORDER BY inst.region`)
}

function filtro_establecimiento_ambito() {
    return db.any(`SELECT 'Región ' || inst.region AS Región, COUNT(CASE WHEN inst.ambito = 'Rural' THEN 1 ELSE NULL END) AS Rural, COUNT(CASE WHEN inst.ambito = 'Urbano' THEN 1 ELSE NULL END) AS Urbano, COUNT(CASE WHEN inst.ambito = 'Rural Disperso' THEN 1 ELSE NULL END) AS Rural_disperso, COUNT(CASE WHEN inst.ambito = 'Rural Aglomerado' THEN 1 ELSE NULL END) AS Rural_aglomerado FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.oferta ofe ON ofe.id_institucion = inst.id_institucion
		JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
		GROUP BY inst.region
		ORDER BY inst.region`)
}

//consultas capas postgis
function capa_regiones() {                                                                                                                                      //ST_AsGeoJSON(ST_Transform(geom, 4326)) transformar
    return db.any(`SELECT                                                                                                                                             
    id, numreg, nombrereg, totallocal, primario, inicial, secundario, superior, formación, superficie, artística, "domic/hosp" AS domhosp, epja, especial, oserveduc, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom
    FROM regiones_Educativas;`)
}

function capa_departamentos() {                                                                                                                                    
    return db.any(`SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom
    FROM departamentos;`)
}

function capa_prueba() {                                                                                                                           
    return db.any(`SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom
    FROM public."Prueba_poligono";`)
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
    buscar_ubicacion,
    buscar_oferta,
    buscar_todos_biblioteca,
    buscar_info_filtro,
    filtro_establecimiento_gestion,
    filtro_establecimiento_ambito,
    capa_regiones,
    capa_departamentos,
    capa_prueba,
    area_bibliotecas

};