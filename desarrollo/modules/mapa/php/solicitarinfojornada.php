<?php

require 'conexion.php';
session_start();

$cueanexo = $_POST['cueanexo'];


// 2 y 4 son lo codigos de completa o extendida
$query = "SELECT DISTINCT jornadaest.jornada
	FROM (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion, e.descripcion as jornada
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.oferta_dictada c ON b.id_localizacion = c.id_localizacion
	JOIN ra2020.jornada d ON c.id_oferta_dictada = d.id_oferta_dictada
	JOIN codigos.jornada_tipo e ON d.c_jornada = e.c_jornada
	WHERE d.c_jornada = 2 or d.c_jornada = 4 
	ORDER BY cueanexo) as jornadaest
	WHERE jornadaest.cueanexo = '$cueanexo'
	ORDER BY jornada";

if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[$obj->jornada] = $obj->jornada;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
}

?>