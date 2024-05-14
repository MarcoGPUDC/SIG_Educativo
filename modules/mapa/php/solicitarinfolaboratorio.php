<?php

require 'conexion.php';
session_start();

$cueanexo = $_POST['cueanexo'];

$query = "SELECT DISTINCT caracteristicasest.cod, caracteristicasest.caracteristica
	FROM (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion, d.c_caracteristica as cod, d.descripcion as caracteristica
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.caracteristicas c ON b.id_localizacion = c.id_localizacion
	JOIN codigos.caracteristica_tipo d ON c.c_caracteristica = d.c_caracteristica
	WHERE (d.c_caracteristica >=211 and d.c_caracteristica <=212) or (d.c_caracteristica >=516 and d.c_caracteristica <=517)
	ORDER BY cueanexo) as caracteristicasest
	WHERE caracteristicasest.cueanexo = '$cueanexo'
	ORDER BY cod ASC"
	;

if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[$obj->caracteristica] = $obj->caracteristica;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
} 

if ($conn){
	pg_close($conn);
}


?>