<?php

require 'conexion.php';
session_start();

$total = $_POST['dato'];
$fila = $_POST['fila'];

$select = "";

$join = "";

$orderby = "";


switch ($total) {
	case 'Establecimientos':
		$select.="a.id_establecimiento as Establecimientos, ";
		$orderby .="Establecimientos ASC, ";
		break;
}

switch ($fila) {
	case 'Región':
		$select.="reg.region as Región";
		$join.="JOIN (SELECT b.id_localizacion, c.valor as region FROM ra2020.establecimiento a JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento JOIN ra2020.loc_campo_prov_valor c ON b.id_localizacion = c.id_localizacion WHERE c.id_campo_prov = '1101162703') as reg ON b.id_localizacion = reg.id_localizacion";
		$orderby .="Región ASC";
		break;
}


$query = "SELECT COUNT(total.$total) as total, total.$fila as fila 
FROM (SELECT DISTINCT $total, $fila
FROM (SELECT  ROW_NUMBER() OVER(PARTITION BY a.id_establecimiento) AS r, $select
FROM ra2020.establecimiento a
JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento 
$join 
WHERE a.c_estado ='1'
ORDER BY $orderby) as r where r.r=1) AS total
GROUP BY total.$fila
ORDER BY total.$fila";


if ($conn) {
	
	$consulta = pg_query($conn, $query);
	if ($consulta) {
		if(pg_num_rows($consulta)>0){
			$data = [];
			while ($obj=pg_fetch_object($consulta)){
				$data[] = $obj;
			}
			echo json_encode($data);
		}else {
			echo json_encode("errornodatos");
		}
	}
} 

if ($conn) {
	pg_close($conn);
}


?>