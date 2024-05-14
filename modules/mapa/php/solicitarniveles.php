<?php

require 'conexion.php';
session_start();




$modalidad = $_POST['modalidad'];

$query = "SELECT Niv.Nivel as nivel
FROM (SELECT DISTINCT l.descripcion as Modalidad, trim(split_part(m.descripcion, '-', 2)) as Nivel
	  FROM ra2020.establecimiento a
	  JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	  JOIN ra2020.oferta_local j ON b.id_localizacion = j.id_localizacion 
	  JOIN ra2020.oloc_modalidad2_assn k ON j.id_oferta_local = k.id_oferta_local 
	  JOIN codigos.modalidad2_tipo l ON k.c_modalidad2 = l.c_modalidad2 
	  JOIN codigos.oferta_tipo m ON j.c_oferta = m.c_oferta 
	  WHERE a.c_estado ='1' and j.c_estado ='1' and (m.c_oferta = '100' or m.c_oferta = '101' or m.c_oferta = '102' or m.c_oferta = '108' or m.c_oferta = '110' or m.c_oferta = '111' or m.c_oferta = '115' or m.c_oferta = '116' or m.c_oferta = '140' or m.c_oferta = '144' or m.c_oferta = '146' or m.c_oferta = '121' or m.c_oferta = '122' or m.c_oferta = '123' or m.c_oferta = '131' or m.c_oferta = '132')
	  ORDER BY Modalidad, Nivel) as Niv
WHERE Niv.Modalidad = '$modalidad'";


if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[$obj->nivel] = $obj->nivel;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
}

?>
