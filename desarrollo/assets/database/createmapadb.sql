BEGIN;

CREATE TABLE localidad (
    id_localidad SERIAL PRIMARY KEY,
    localidad TEXT
);

CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    departamento TEXT
);

CREATE TABLE institucion (
    id_institucion INT PRIMARY KEY,
    id_departamento INT REFERENCES departamento(id_departamento),
    id_localidad INT REFERENCES localidad(id_localidad),
    numero INT,
    cue INT,
    anexo INT,
    funcion TEXT,
    region TEXT,
    domicilio TEXT,
    cp TEXT,
    ambito TEXT,
    web TEXT,
    email_inst TEXT,
    tel TEXT
);
CREATE TABLE contacto (
    id_contacto SERIAL PRIMARY KEY,
    id_institucion INT REFERENCES institucion(id_institucion),
    responsable TEXT,
    email TEXT,
    tel_resp INT
);

CREATE TABLE ofertas_educativas (
    id_oferta_educativa SERIAL PRIMARY KEY,
    nombre TEXT,
    duracion INT
);

CREATE TABLE modalidades_educativas (
    id_modalidad SERIAL PRIMARY KEY,
    nombre TEXT
);

CREATE TABLE nivel (
    id_nivel SERIAL PRIMARY KEY,
    nombre TEXT
);

CREATE TABLE oferta (
    id_oferta SERIAL PRIMARY KEY,
    id_institucion INT REFERENCES institucion(id_institucion),
    id_modalidad INT REFERENCES modalidades_educativas(id_modalidad),
    id_nivel INT REFERENCES nivel(id_nivel),
    id_oferta_educativa INT REFERENCES ofertas_educativas(id_oferta_educativa)
);

CREATE TABLE info_ad (
    id_institucion INT REFERENCES departamento(id_departamento),
    aniversario TEXT,
    proyectos TEXT,
    actividades TEXT
);

CREATE TABLE equipamiento (
    id_institucion INT REFERENCES institucion(id_institucion),
    biblioteca TEXT,
    laboratorio TEXT,
    informatica TEXT,
    artistica TEXT,
    taller TEXT
);

CREATE TABLE turno (
    id_turno SERIAL PRIMARY KEY,
    nombre TEXT
);

CREATE TABLE funcionamiento (
    id_institucion INT REFERENCES institucion(id_institucion),
    jornada TEXT,
    id_turno INT REFERENCES turno(id_turno),
    gestion TEXT,
    dependencia TEXT
);

CREATE TABLE seccion (
    id_seccion SERIAL PRIMARY KEY,
    id_institucion INT REFERENCES institucion(id_institucion),
    nombre TEXT,
    grado TEXT,
    id_turno INT
);

CREATE TABLE matricula (
    id_institucion INT REFERENCES institucion(id_institucion),
    id_seccion INT REFERENCES seccion(id_seccion),
    varones INT,
    mujeres INT,
    no_binario INT
);

CREATE TABLE infraestructura (
    id_institucion INT REFERENCES institucion(id_institucion),
    agua TEXT,
    internet TEXT,
    fuente_internet TEXT,
    energia TEXT,
    fuente_energia TEXT,
    calefaccion TEXT
);

CREATE TABLE comparte (
    id_institucion INT REFERENCES institucion(id_institucion),
    id_institucion_comparte INT,
    nombre_institucion_comparte INT,
    numero_institucion_comparte INT,
);

END;