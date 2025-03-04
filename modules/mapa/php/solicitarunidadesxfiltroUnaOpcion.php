<?php

require 'conexion.php';
session_start();

$total = $_POST['dato'];
$fila = $_POST['fila'];

$select = "";

$join = "";

$orderby = "";


switch ($total) {
	case 'Unidades':
		$select.="CONCAT (a.cue ,b.anexo) as Unidades, ";
		$orderby .="Unidades";
		break;
}

switch ($fila) {
	case 'Nivel':
		$select.="CASE WHEN d.c_oferta = 115 THEN 'Nivel Superior no Universitario' WHEN d.c_oferta = 108 THEN 'Nivel Secundario' WHEN d.c_oferta = 116 THEN 'Formación Profesional' WHEN d.c_oferta = 131 THEN 'Nivel Secundario' WHEN d.c_oferta = 132 THEN 'Nivel Secundario' WHEN d.c_oferta = 171 THEN 'Nivel Secundario' WHEN d.c_oferta = 121 THEN 'Nivel Inicial' WHEN d.c_oferta = 122 THEN 'Nivel Inicial' WHEN d.c_oferta = 123 THEN 'Nivel Primario' WHEN d.c_oferta = 140 THEN 'Nivel Primario' WHEN d.c_oferta = 144 THEN 'Nivel Secundario' WHEN d.c_oferta = 100 THEN 'Nivel Inicial' WHEN d.c_oferta = 101 THEN 'Nivel Inicial' WHEN d.c_oferta = 102 THEN 'Nivel Primario' WHEN d.c_oferta = 110 THEN 'Nivel Secundario' WHEN d.c_oferta = 111 THEN 'Nivel Secundario' END as Nivel, d.descripcion as Modalidad";
		$join.="JOIN ra2020.oferta_local c ON b.id_localizacion = c.id_localizacion JOIN codigos.oferta_tipo d ON c.c_oferta = d.c_oferta";
		$orderby .="";
		break;
}


$query = "SELECT COUNT(total.$total) as total, total.$fila as fila 
FROM (SELECT DISTINCT $total, $fila, Modalidad
FROM (SELECT ROW_NUMBER() OVER(PARTITION BY a.cue , b.anexo, CASE
WHEN d.c_oferta = 115 THEN 'Nivel Superior no Universitario' -- Común - SNU 
WHEN d.c_oferta = 108 THEN 'Nivel Secundario' -- Común - Solo Secundaria Básica req. 6 años
WHEN d.c_oferta = 116 THEN 'Formación Profesional' -- Común-Servicios Alternativos/Complementarios
WHEN d.c_oferta = 131 THEN 'Nivel Secundario' -- Especial - Educación Integral para Adolescentes y Jóvenes/Secundaria Completa req. 6 años
WHEN d.c_oferta = 132 THEN 'Nivel Secundario' -- Especial - Educación Integral para Adolescentes y Jóvenes/Secundaria Completa req. 7 años
WHEN d.c_oferta = 171 THEN 'Nivel Secundario' -- Especial - Educación Integral para Adolescentes y Jóvenes
WHEN d.c_oferta = 121 THEN 'Nivel Inicial' -- Especial - Jardín maternal 
WHEN d.c_oferta = 122 THEN 'Nivel Inicial' -- Especial - Jardín de infantes 
WHEN d.c_oferta = 123 THEN 'Nivel Primario' -- Especial - Primaria de 6 años 
WHEN d.c_oferta = 140 THEN 'Nivel Primario' -- Adultos - Primaria 
WHEN d.c_oferta = 144 THEN 'Nivel Secundario' -- Adultos - Secundaria Completa
WHEN d.c_oferta = 100 THEN 'Nivel Inicial' -- Común - Jardín maternal 
WHEN d.c_oferta = 101 THEN 'Nivel Inicial' -- Común - Jardín de infantes 
WHEN d.c_oferta = 102 THEN 'Nivel Primario' -- Común - Primaria de 6 años 
WHEN d.c_oferta = 110 THEN 'Nivel Secundario' -- Común - Secundaria Completa req. 6 años 
WHEN d.c_oferta = 111 THEN 'Nivel Secundario' -- Común - Secundaria Completa req. 7 años 
END) AS r, $select
FROM ra2020.establecimiento a
JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento 
$join 
WHERE a.c_estado ='1' and c.c_estado ='1' and (
	d.c_oferta = 115 or
	d.c_oferta = 108 or
	d.c_oferta = 116 or
	d.c_oferta = 131 or
	d.c_oferta = 132 or
	d.c_oferta = 171 or
	d.c_oferta = 121 or
	d.c_oferta = 122 or
	d.c_oferta = 123 or
	d.c_oferta = 140 or
	d.c_oferta = 144 or
	d.c_oferta = 100 or
	d.c_oferta = 101 or
	d.c_oferta = 102 or
	d.c_oferta = 110 or
	d.c_oferta = 111)
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