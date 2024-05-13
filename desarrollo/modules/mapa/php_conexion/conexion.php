<?php
// Parámetros de conexión a la base de datos PostgreSQL
$host = 'localhost';
$puerto = '5432';
$nombre_bd = 'nuevo_mapa_db';
$usuario = 'postgres';
$contrasena = 'admin';

// Establecer conexión
$conexion = pg_connect("host=$host port=$puerto dbname=$nombre_bd user=$usuario password=$contrasena");

// Verificar la conexión
if (!$conexion) {
    die("Error al conectar a la base de datos: " . pg_last_error());
} else {
    echo "Conexión exitosa a la base de datos";
}
?>