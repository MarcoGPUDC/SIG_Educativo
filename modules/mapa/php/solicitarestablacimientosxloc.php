<?php

require 'conexion.php';
session_start();

$region = $_POST['regionFormControlSelect'];

$where = "";

if($region != null and $region != "todo"){
	$where = "WHERE region = '$region'";
	$localidad = $_POST['departamentoFormControlSelect'];
	if($localidad != null and $localidad != "todo"){
		$where.=" and localidad = '$localidad' ";
		$direccion = $_POST['direccionFormControlSelect'];
		if($direccion != null and $direccion != "todo" and $direccion != "sinddomicilioregistrado"){
			$where.=" and domicilio = '$direccion'";
		}
		if($direccion != null and $direccion != "todo" and $direccion == "sinddomicilioregistrado"){
			$where.=" and domicilio = ' '";
		}
	}
}

$query = "SELECT DISTINCT CONCAT(cue,anexo) as cueanexo
	FROM (SELECT a.cue as cue, b.id_localizacion, b.anexo as anexo, c.valor as region
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.loc_campo_prov_valor c ON b.id_localizacion = c.id_localizacion
	-- 1101162703 es para region y 110116704 para departamento
	WHERE c.id_campo_prov = 1101162703
	) as est 
	JOIN (SELECT a.id_localizacion, UPPER(CONCAT(b.calle,' ', b.nro)) as domicilio, c.nombre as localidad
	FROM ra2020.localizacion_domicilio a
	JOIN ra2020.domicilio b ON a.id_domicilio = b.id_domicilio
	JOIN codigos.localidad_tipo c ON c.c_localidad = b.c_localidad
	WHERE c_tipo_dom = '1') as loc ON loc.id_localizacion = est.id_localizacion
	$where
	ORDER BY cueanexo ASC";

if ($conn) {
	if($region != 'todo'){
		$consulta = pg_query($conn, $query);
		if ($consulta) {
			if(pg_num_rows($consulta)>0){
				$data = [];
				while ($obj=pg_fetch_object($consulta)){
					$data[$obj->cueanexo] = $obj->cueanexo;
				}
				echo json_encode($data);
			}else {
				echo json_encode("errornodatos");
			}
		}
	} else {
		echo json_encode("errornoregion");
	}
}

if ($conn) {
	pg_close($conn);
}



?>
