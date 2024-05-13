<?php

require 'conexion.php';
session_start();

$cueanexo = $_POST['cueanexo'];



$query = "SELECT DISTINCT jornadaest.turno
FROM (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion, e.descripcion as turno
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.oferta_dictada c ON b.id_localizacion = c.id_localizacion
	JOIN ra2020.horario d ON c.id_oferta_dictada = d.id_oferta_dictada
	JOIN codigos.turno_tipo e ON d.c_turno = e.c_turno
	ORDER BY cueanexo) as jornadaest
	WHERE jornadaest.cueanexo = '$cueanexo'
	ORDER BY turno";

if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){	
				$data[$obj->turno] = $obj->turno;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
}

?>