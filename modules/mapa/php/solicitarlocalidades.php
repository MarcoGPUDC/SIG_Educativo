<?php

require 'conexion.php';
session_start();



$region = $_POST['region'];

$query = "SELECT DISTINCT region, localidad
	FROM (SELECT a.id_establecimiento, b.id_localizacion, c.valor as region
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.loc_campo_prov_valor c ON b.id_localizacion = c.id_localizacion
	WHERE c.id_campo_prov = 1101162703
	) as est 
	JOIN (SELECT a.id_localizacion, CONCAT(b.calle,' ', b.nro) as domicilio, c.nombre as localidad
	FROM ra2020.localizacion_domicilio a
	JOIN ra2020.domicilio b ON a.id_domicilio = b.id_domicilio
	JOIN codigos.localidad_tipo c ON c.c_localidad = b.c_localidad
	WHERE c_tipo_dom = '1') as loc ON loc.id_localizacion = est.id_localizacion
	WHERE region = '$region'
	ORDER BY localidad ASC";


if ($conn) {
	$consulta = pg_query($conn, $query);

	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[$obj->localidad] = $obj->localidad;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}

}

?>
