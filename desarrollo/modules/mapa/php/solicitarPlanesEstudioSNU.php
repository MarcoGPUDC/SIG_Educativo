<?php

require 'conexion.php';
session_start();

$modalidad = $_POST['modalidad'];
$nivel = $_POST['nivel'];

$query = "SELECT DISTINCT Ori.Orientacion as orientacion
FROM (SELECT DISTINCT a.id_establecimiento, trim(split_part(m.descripcion, '-', 1)) as Modalidad, trim(split_part(m.descripcion, '-', 2)) as Nivel, ofe.descripcion as Orientacion 
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.oferta_local j ON b.id_localizacion = j.id_localizacion 
	JOIN codigos.oferta_tipo m ON j.c_oferta = m.c_oferta 
	JOIN (SELECT DISTINCT pl.id_oferta_local, u.descripcion
	FROM ra2020.oferta_local j 
	JOIN ra2020.plan_estudio_local pl ON j.id_oferta_local = pl.id_oferta_local
	JOIN ra2020.plan_estudio_local_superior pls ON pls.id_plan_estudio_local = pl.id_plan_estudio_local
	JOIN ra2020.titulo_oferta s ON pl.c_titulo_oferta = s.c_titulo_oferta 
	JOIN ra2020.titulo t ON t.id_titulo = s.id_titulo
	JOIN codigos.carrera_tipo u ON t.c_carrera = u.c_carrera
	WHERE j.c_oferta = '115') as ofe ON ofe.id_oferta_local = j.id_oferta_local
	WHERE a.c_estado ='1' and j.c_estado ='1') as Ori
WHERE Ori.Modalidad = 'Común' and Ori.Nivel = 'SNU' 
ORDER BY Orientacion";


if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[$obj->orientacion] = $obj->orientacion;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
}

?>