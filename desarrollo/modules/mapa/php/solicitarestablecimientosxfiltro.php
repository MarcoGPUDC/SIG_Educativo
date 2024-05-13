<?php

require 'conexion.php';
session_start();

$total = $_POST['dato'];
$fila = $_POST['fila'];
$columna = $_POST['columna'];

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
		$join.="JOIN (SELECT b.id_localizacion, c.valor as region FROM ra2020.establecimiento a JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento JOIN ra2020.loc_campo_prov_valor c ON b.id_localizacion = c.id_localizacion WHERE c.id_campo_prov = '1101162703') as reg ON b.id_localizacion = reg.id_localizacion ";
		$orderby .="Región ASC, ";
		break;
}

switch ($columna) {
	case 'Gestion':
		$select.=", h.descripcion as Gestion";
		$join.="JOIN codigos.sector_tipo h ON a.c_sector = h.c_sector ";
		$orderby .="Gestion ASC";
		break;
	case 'Ámbito':
		$select.=", CASE WHEN g.descripcion = 'Rural'  THEN 'Rural' WHEN g.descripcion = 'Rural Aglomerado' THEN 'Rural' WHEN g.descripcion = 'Rural Disperso' THEN 'Rural' WHEN g.descripcion = 'Urbano' THEN 'Urbano' WHEN g.descripcion = 'Sin Información' THEN 'Sin Información' END as Ámbito";
		$join.="JOIN codigos.ambito_tipo g ON b.c_ambito = g.c_ambito ";
		$orderby .="Ámbito DESC";
		break;
}

$query = "SELECT COUNT(total.$total) as total, total.$fila as fila, total.$columna as columna 
FROM (SELECT DISTINCT $total, $fila, $columna
	FROM (SELECT  ROW_NUMBER() OVER(PARTITION BY a.id_establecimiento) AS r , $select
FROM ra2020.establecimiento a
JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
$join
-- c-estado = 1 es establecimiento activo
WHERE a.c_estado ='1' 
ORDER BY $orderby) as r where r.r=1) AS total
GROUP BY total.$fila, total.$columna
ORDER BY total.$fila, total.$columna";


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