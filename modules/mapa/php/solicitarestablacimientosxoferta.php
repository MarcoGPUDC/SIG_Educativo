<?php

require 'conexion.php';
session_start();

$tipo = $_POST['f-tipo'];
$orientacion = $_POST['orientacion'];
$dictado = $_POST['dictado'];

$whereG = "";
$whereS = "";
$join = "";
$select = "";
$joindicatadoSnu = "";
$selectdictado = "";

if($tipo != null and $tipo != "todo"){
	$whereG = "WHERE Ori.Modalidad = '$tipo'";
	$nivel = $_POST['f-nivel'];
	if($nivel != null and $nivel != "todo"){
		$whereG.=" and Ori.Nivel = '$nivel' ";
		if(str_contains(strtolower($nivel), 'secundari')) {
   			 $join = "JOIN ra2020.plan_estudio_local p ON j.id_oferta_local = p.id_oferta_local JOIN ra2020.plan_estudio_local_secundaria n ON p.id_plan_estudio_local = n.id_plan_estudio_local JOIN codigos.orientacion_tipo o ON n.c_orientacion = o.c_orientacion";
   			 $select .= ", o.descripcion as Orientacion";
   			 $whereS = "WHERE a.c_estado ='1' and j.c_estado ='1' and (m.c_oferta = '100' or m.c_oferta = '101' or m.c_oferta = '102' or m.c_oferta = '108' or m.c_oferta = '110' or m.c_oferta = '111' or m.c_oferta = '115' or m.c_oferta = '116' or m.c_oferta = '140' or m.c_oferta = '144' or m.c_oferta = '146' or m.c_oferta = '121' or m.c_oferta = '122' or m.c_oferta = '123' or m.c_oferta = '131' or m.c_oferta = '132') ORDER BY Modalidad, Nivel";
   			if($orientacion != null and $orientacion != "todo"){
				$whereG.=" and Ori.Orientacion = '$orientacion' ";
			}
			if($dictado != null and $dictado != "todo"){
				$whereG.=" and Ori.Dictado = '$dictado' ";
				$select .= ", t.descripcion as Dictado";
				$join .= " JOIN codigos.dictado_tipo t ON p.c_dictado = t.c_dictado";
			}
		}
		if(str_contains(strtolower($nivel), 'snu')) {
   			if($orientacion != null and $orientacion != "todo"){
				$whereG.=" and Ori.Orientacion = '$orientacion' ";
			}
			if($dictado != null and $dictado != "todo"){
				$whereG.=" and Ori.Dictado = '$dictado' ";
				$select = ", ofe.Dictado as Dictado";
				$selectdictado = " , dt.descripcion as Dictado ";
				$joindicatadoSnu = " JOIN codigos.dictado_tipo dt ON pl.c_dictado = dt.c_dictado ";
			}
   			 $join ="JOIN (SELECT DISTINCT pl.id_oferta_local, u.descripcion $selectdictado FROM ra2020.oferta_local j JOIN ra2020.plan_estudio_local pl ON j.id_oferta_local = pl.id_oferta_local JOIN ra2020.plan_estudio_local_superior pls ON pls.id_plan_estudio_local = pl.id_plan_estudio_local JOIN ra2020.titulo_oferta s ON pl.c_titulo_oferta = s.c_titulo_oferta  JOIN ra2020.titulo t ON t.id_titulo = s.id_titulo  JOIN codigos.carrera_tipo u ON t.c_carrera = u.c_carrera $joindicatadoSnu WHERE j.c_oferta = '115') as ofe ON ofe.id_oferta_local = j.id_oferta_local";
   			 $select .= ", ofe.descripcion as Orientacion";
   			 $whereS = " WHERE a.c_estado ='1' and j.c_estado ='1'";
		}

	}
}

$query = "SELECT DISTINCT CONCAT(Ori.cue,Ori.anexo) as cueanexo
FROM (SELECT DISTINCT a.cue as cue, b.anexo as anexo, l.descripcion as Modalidad, trim(split_part(m.descripcion, '-', 2)) as Nivel $select
	FROM ra2020.establecimiento a
	JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	JOIN ra2020.oferta_local j ON b.id_localizacion = j.id_localizacion 
	JOIN ra2020.oloc_modalidad2_assn k ON j.id_oferta_local = k.id_oferta_local 
	JOIN codigos.modalidad2_tipo l ON k.c_modalidad2 = l.c_modalidad2 
	JOIN codigos.oferta_tipo m ON j.c_oferta = m.c_oferta 
	$join
	$whereS) as Ori
$whereG
ORDER BY cueanexo asc";


if ($conn) {
	if($tipo != 'todo'){
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
		echo json_encode("errornotipo");
	}
}

if ($conn) {
	pg_close($conn);
}


?>