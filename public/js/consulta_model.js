const conectarDB = require('../../modules/buscador/db_conexion');
const mysqldb = require('./mysql-connection.js');

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
    return db.any('SELECT id_localidad AS id, localidad FROM padron.localidad ORDER BY id asc;');
};

function buscar_todos_departamento () {
    return db.any('SELECT id_departamento AS id, departamento FROM padron.departamento ORDER BY id asc;');
};

function buscar_todos_domicilio () {
    return db.any('SELECT id_institucion AS id, domicilio FROM padron.institucion;');
};

function buscar_todos_ambito () {
    return db.any('SELECT DISTINCT ambito FROM padron.institucion WHERE ambito is not null;');
};

function busqueda_simple_todo () {
    return db.any(`SELECT inst.*, COALESCE(inst.responsable, 'Sin Informacion') AS responsable, COALESCE(inst.tel, 'Sin Informacion') AS tel_resp, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM padron.v_establec_educativos AS inst`);
};

function buscar_ubicacion(id) {
    return db.one (`SELECT inst.id_institucion, inst.nombre, inst.numero, inst.domicilio, loc.localidad, inst.region, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM padron.institucion inst JOIN padron.georeferencia geo ON geo.id_institucion = inst.id_institucion JOIN padron.localidad loc ON loc.id_localidad = inst.id_localidad WHERE inst.id_institucion = $1;`, id)
}

function buscar_todos_biblioteca() {
    return db.any (`SELECT bi.id_biblioteca, bi.nombre, bi.domicilio, bi.cp, loc.localidad, bi.email, bi.horario, bi.region, bi.long, bi.lat FROM padron.biblioteca bi 
                    JOIN padron.localidad loc ON loc.id_localidad = bi.id_localidad`)
}

function buscar_todos_id() {
    return db.any (`SELECT id_institucion FROM padron.institucion`)
}

function buscar_todos_cueanexo() {
    return db.any (`SELECT id_institucion AS id, cue_anexo AS cueanexo FROM padron.institucion`)
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
    return db.any(`SELECT inst.id_institucion, inst.cue_anexo, func.jornada, turno.nombre AS turno, nivel.nombre AS nivel, mod.nombre AS modalidad, inst.cue, inst.anexo FROM padron.institucion inst 
    LEFT JOIN padron.funcionamiento func ON inst.id_institucion = func.id_institucion
    LEFT JOIN padron.turno turno ON turno.id_turno = func.id_turno
    JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
    LEFT JOIN padron.modalidades_educativas mod ON mod.id_modalidad = ofe.id_modalidad
    LEFT JOIN padron.nivel nivel ON ofe.id_nivel = nivel.id_nivel WHERE inst.id_institucion = $1;`,id);
};

//busca info infraestructura y equipamiento
function busqueda_adicional_infra (id) {
    return db.any (`SELECT inst.id_institucion, inst.cue_anexo, equi.biblioteca, equi.laboratorio, equi.informatica, equi.artistica, equi.taller, infra.agua, infra.internet, infra.fuente_internet, infra.energia, infra.fuente_energia, infra.calefaccion FROM padron.institucion inst
        JOIN padron.equipamiento equi ON equi.id_institucion = inst.id_institucion
        JOIN padron.infraestructura infra ON infra.id_institucion = inst. id_institucion 
        WHERE inst.id_institucion = $1;
        `,id
    )
}

//busca sede o anexos de una institucion
function busqueda_adicional_sedeAnexo(cue) {
    return db.any(`SELECT id_institucion, cue, anexo FROM padron.institucion WHERE cue = $1
        ORDER BY id_institucion ASC `, [cue])
}



//consultas para visualizar en el mapa
//info para anexar al popup de las instituciones
function buscar_info_popup_inst() {
    return db.any(`SELECT * FROM (SELECT inst.funcion, inst.cue_anexo, (CASE WHEN inst.numero = 'Z000023' THEN 700 WHEN inst.numero = 'Z000024' THEN 700 WHEN inst.numero = 'CEF' THEN 700 WHEN inst.numero > '0' THEN inst.numero::INT END) AS numero, inst.nombre, inst.region, loc.localidad, inst.domicilio, inst.tel, cont.email, inst.web, cont.responsable, cont.tel_resp, niv.nombre AS nivel, ST_AsGeoJSON(ST_Transform(geo.geom, 4326)) AS geom, inst.id_institucion, moda.nombre AS modalidad, ST_AsText(ST_transform(rad.geom,4326)) AS area
    FROM padron.institucion inst 
    LEFT JOIN padron.localidad loc ON inst.id_localidad = loc.id_localidad 
    LEFT JOIN padron.contacto cont ON inst.id_institucion = cont.id_institucion
    LEFT JOIN padron.georeferencia geo ON inst.id_institucion = geo.id_institucion
	LEFT JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
	LEFT JOIN padron.nivel niv ON ofe.id_nivel = niv.id_nivel
    LEFT JOIN padron.modalidades_educativas moda ON moda.id_modalidad = ofe.id_modalidad
    LEFT JOIN public.radios_escolares rad ON rad.id_institucion = inst.id_institucion
    WHERE inst.funcion = 'Activo') tmp
    GROUP BY tmp.funcion, tmp.nivel, tmp.cue_anexo, tmp.numero, tmp.nombre, tmp.region, tmp.localidad, tmp.domicilio, tmp.tel, tmp.email, tmp.web, tmp.responsable, tmp.tel_resp, tmp.geom, tmp.id_institucion, tmp.modalidad, tmp.area
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
    return db.any(`SELECT inst.id_institucion, inst.nombre, inst.numero, niv.nombre AS nivel, moda.nombre AS modalidad, geo.long, geo.lat FROM padron.institucion inst JOIN padron.modalidad_nivel ofe ON inst.id_institucion = ofe.id_institucion
        JOIN padron.modalidades_educativas moda ON moda.id_modalidad = ofe.id_modalidad
        JOIN padron.georeferencia geo ON inst.id_institucion = geo.id_institucion
        JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel WHERE niv.nombre = $1 AND moda.nombre = $2`, [nivel, modalidad])
}
//Buscar por ubicaion
function buscar_localizacion(localidad, departamento, region) {
    return db.any(`SELECT inst.nombre, inst.numero, inst.region, loc.localidad, depa.departamento, inst.domicilio ,niv.nombre AS nivel, moda.nombre AS modalidad, ST_AsGeoJSON(ST_transform(geo.geom,4326)) AS geom FROM padron.institucion inst JOIN padron.departamento depa ON depa.id_departamento = inst.id_departamento
    JOIN padron.localidad loc ON loc.id_localidad = inst.id_localidad
    JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
    JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
    JOIN padron.modalidades_educativas moda ON moda.id_modalidad = ofe.id_modalidad
    JOIN padron.georeferencia geo ON geo.id_institucion = inst.id_institucion 
    WHERE loc.localidad = $1 OR depa.departamento = $2 OR inst.region = $3`, [localidad, departamento, region])
}


//busquedas para el filtro
function buscar_info_filtro(){
    return db.any(`SELECT 'Región ' || inst.region AS Región, inst.ambito, inst.numero, COALESCE(mat.varones, 0) AS masculino, COALESCE(mat.mujeres, 0) AS femenino, COALESCE(mat.no_binario, 0) AS no_binario, func.gestion, niv.nombre AS nivel FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
		JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
		ORDER BY inst.numero`)
}

function filtro_establecimiento_gestion() {
    return db.any(`SELECT 'Región ' || inst.region AS Región, COUNT(CASE WHEN func.gestion = 'Estatal' THEN 1 ELSE NULL END) AS Estatal, COUNT(CASE WHEN func.gestion = 'Privado' THEN 1 ELSE NULL END) AS Privada, COUNT(CASE WHEN func.gestion = 'Gestión social/cooperativa' THEN 1 ELSE NULL END) AS Social_Cooperativa FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
		JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel
		GROUP BY inst.region
		ORDER BY inst.region`)
}

function filtro_establecimiento_ambito() {
    return db.any(`SELECT 'Región ' || inst.region AS Región, COUNT(CASE WHEN inst.ambito = 'Rural' THEN 1 ELSE NULL END) AS Rural, COUNT(CASE WHEN inst.ambito = 'Urbano' THEN 1 ELSE NULL END) AS Urbano, COUNT(CASE WHEN inst.ambito = 'Rural Disperso' THEN 1 ELSE NULL END) AS Rural_disperso, COUNT(CASE WHEN inst.ambito = 'Rural Aglomerado' THEN 1 ELSE NULL END) AS Rural_aglomerado FROM padron.matricula mat 
        RIGHT JOIN padron.institucion inst ON inst.id_institucion = mat.id_institucion 
        JOIN padron.funcionamiento func ON func.id_institucion = inst.id_institucion 
        JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
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

function capa_areas () {
    return db.any(`SELECT id_institucion, false AS mostrar, ST_AsText(ST_transform(rad.geom,4326)) AS area FROM public.radios_escolares rad`)
}

//CONSULTAS PARA AMB
function crear_institucion(departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo){
    const id = db.query(`INSERT INTO padron.institucion(
	id_departamento, id_localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email_inst, nombre, tel, cue_anexo)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id_institucion`, [departamento, localidad, numero, cue, anexo, funcion, region, domicilio, cp, ambito, web, email, nombre, tel, cue_anexo])
    return id;
}

function cargar_ubicacion (id_institucion, lat, long) {
    db.query(`INSERT INTO padron.georeferencia (id_institucion, lat, long, geom)
    VALUES ($1, ST_X(ST_Transform(ST_SetSRID(ST_MakePoint($3,$2), 4326),22172)), ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint($3,$2), 4326),22172)), ST_Transform(ST_SetSRID(ST_MakePoint($3,$2), 4326),22172))`, [id_institucion, lat, long])
}

function borrar_institucion (id) {
    db.tx( t => {
        t.none(`DELETE FROM padron.georeferencia WHERE id_institucion = $1`, [id]);
        t.none('DELETE FROM padron.modalidad_nivel WHERE id_institucion = $1',[id]);
        t.none(`DELETE FROM padron.institucion WHERE id_institucion = $1`, [id]);
    });
}

function cargar_oferta(id, modalidad, nivel){
    db.tx (t=>{
        t.none('INSERT INTO padron.modalidad_nivel (id_institucion, id_modalidad, id_nivel) VALUES ($1, $2, $3)', [id, modalidad, nivel]);
    })
}

function modificar_institucion (id, departamento, localidad, numero, region, domicilio, cp, ambito, web, email, nombre, tel){
    db.tx (t => {
        t.none (`UPDATE padron.institucion
                    SET id_localidad=$1, numero=$2, region=$3, domicilio=$4, cp=$5, ambito=$6, web=$7, email_inst=$8, nombre=$9, tel=$10
	                WHERE id_institucion = $11;
            `, [departamento, localidad, numero, region, domicilio, cp, ambito, web, email, nombre, tel, id])
    })
}

function modificar_oferta (id, nivel, modalidad){
    db.tx (t => {
        t.none (`UPDATE padron.modalidad_nivel
                    SET id_nivel= $2, id_modalidad= $3
                    WHERE id_institucion = $1;  
            `, [id, nivel, modalidad])
    })
}

//Inicio de sesion
function verificar_usuario (username, password){
    return db.any('SELECT * FROM usuario.login log WHERE log.usuario = $1 AND log.contra = $2;', [username, password])
}

function registrar_usuario (rol,nombre,apellido,usuario,contraseña){
    var idUser = db.any(`INSERT INTO usuario.users (id_rol, nombre, apellido) VALUES ($1, $2, $3) RETURNING id;`, [rol,nombre,apellido]);
    db.none('INSERT INTO usuario.login (id_usuario, usuario, contra) VALUES ($1, $2, $3);',[idUser, usuario, contraseña]);
}

function cambiar_contra (contraseña){
    db.tx( t => {
        t.none(`UPDATE usuario.login (contra) VALUES ($1)`, contraseña);
})}


//consulta capa equipamiento e infraestructura
function buscar_info_equi_infra(){
    return db.any(`SELECT *, (CASE WHEN biblioteca IS NOT NULL AND biblioteca = 'SI' THEN 1 ELSE 0 END+
		CASE WHEN laboratorio IS NOT NULL AND laboratorio = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN informatica IS NOT NULL AND informatica = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN artistica IS NOT NULL AND artistica = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN taller IS NOT NULL AND taller = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN agua IS NOT NULL AND agua = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN internet IS NOT NULL AND internet = 'SI' THEN 1 ELSE 0 END+
		CASE WHEN energia IS NOT NULL AND energia = 'SI' THEN 1 ELSE 0 END+
        CASE WHEN calefaccion IS NOT NULL AND calefaccion = 'SI' THEN 1 ELSE 0 END
        )::integer AS completitud, inst.id_institucion AS id, inst.cue_anexo, inst.domicilio, loc.localidad, inst.region, inst.email_inst AS email, inst.web, niv.nombre AS nivel, inst.nombre
        FROM padron.v_establec_base_equi_infra infra JOIN padron.institucion inst ON inst.id_institucion = infra.id_institucion
        JOIN padron.localidad loc ON loc.id_localidad = inst.id_localidad
        JOIN padron.modalidad_nivel ofe ON ofe.id_institucion = inst.id_institucion
        JOIN padron.nivel niv ON niv.id_nivel = ofe.id_nivel`)
}
function buscar_porcentaje_equi_infra(){
    return db.one(`SELECT TRUNC(AVG(completitud)) AS promedio_completo
    FROM (SELECT (
        (CASE WHEN biblioteca IS NOT NULL AND biblioteca = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN laboratorio IS NOT NULL AND laboratorio = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN informatica IS NOT NULL AND informatica = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN artistica IS NOT NULL OR artistica = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN taller IS NOT NULL AND taller = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN agua IS NOT NULL AND agua = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN internet IS NOT NULL AND internet = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN energia IS NOT NULL AND energia = 'SI' THEN 1 ELSE 0 END
        +
        CASE WHEN calefaccion IS NOT NULL AND calefaccion = 'SI' THEN 1 ELSE 0 END
        )::double precision / 9)*100 AS completitud FROM padron.v_establec_base_equi_infra) subquery;
    `)
}


//consultas a mysql
async function verificar_usuario_mysql(username) {
    return mysqldb.query(`SELECT users.id, users.cuil_cuit, users.numero_documento, users.email, users.encrypted_password, rol.name FROM ddjj_production.users users 
                        JOIN ddjj_production.user_roles roles ON roles.user_id = users.id
                        JOIN ddjj_production.roles rol ON rol.id = roles.role_id WHERE users.email = ?`, [username])
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
    buscar_todos_ambito,
    buscar_todos_id,
    buscar_todos_cueanexo,
    busqueda_simple,
    buscar_info_popup_inst,
    busqueda_adicional,
    busqueda_adicional_infra,
    busqueda_adicional_sedeAnexo,
    buscar_info_supervision,
    buscar_info_delegacion,
    busqueda_simple_todo,
    buscar_ubicacion,
    buscar_localizacion,
    buscar_oferta,
    buscar_todos_biblioteca,
    buscar_info_filtro,
    filtro_establecimiento_gestion,
    filtro_establecimiento_ambito,
    capa_regiones,
    capa_departamentos,
    capa_prueba,
    capa_areas,
    area_bibliotecas,
    crear_institucion,
    cargar_ubicacion,
    cargar_oferta,
    borrar_institucion,
    modificar_institucion,
    modificar_oferta,
    verificar_usuario,
    verificar_usuario_mysql,
    registrar_usuario,
    cambiar_contra,
    buscar_info_equi_infra,
    buscar_porcentaje_equi_infra
};