<?php
include "conexion.php"
session_start();

$consulta = "SELECT * FROM padron.intitucion AS inst 
JOIN padron.localidad AS loc ON loc.id_localidad = inst.id_localidad 
JOIN padron.departamento AS depart ON depart.id_departamento = inst.id_departamento
JOIN padron.oferta AS oferta ON oferta.id_institucion = inst.id_institucion
JOIN padron ofertas_educativas AS ofe_educativa ON ofe_educativa.id_oferta_educativa = ofeta.id_ofeta_educativa
JOIN padron.modalidades.educativas AS mod_edu ON mod_edu.id_modalidad = oferta.id_modalidad ORDER BY inst.region ASC";

$consultar = pg_query($conexion, $consulta);
$institucion = pg_fetch_all($consultar);

header('Content-Type: application/json');
echo json_encode($institucion);
pg_close($conexion);
exit;
?>