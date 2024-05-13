<?php

require 'conexion.php';
session_start();

$turno = $_POST['turnoFormControlSelect'];
$jornada = $_POST['jornadaFormControlSelect'];
$ambito = $_POST['ambitoFormControlSelect'];
$gestion = $_POST['sectorFormControlSelect'];
$biblioteca = $_POST['bibliotecaFormControlSelect'];
$laboratorio = $_POST['laboratorioFormControlSelect'];
$conexionint = $_POST['conexioninternetFormControlSelect'];
$idioma = $_POST['idiomaFormControlSelect'];
//$discapacidad = $_POST['discapacidadatendidaFormControlSelect'];

$nombrecapa = $_POST['nombrecapa'];

$selected=true;

if($turno=='todo' and $jornada=='todo' and $ambito=='todo' and $gestion=='todo' and $idioma=='todo' and $biblioteca=='todo' and $laboratorio=='todo' and $conexionint=='todo'){
	$selected=false;
}

$wheresincaracteristica = "WHERE ";
$whereprimercaracteristica = "WHERE ";
$wheresegundacaracteristica = "WHERE ";
$whereterceracaracteristica = "WHERE ";

switch ($turno) {
	case 'todo':
		$wheresincaracteristica.="";
		break;
	case 'manana':
		$wheresincaracteristica.="e.c_turno = '6'";
		break;
	case 'tarde':
		$wheresincaracteristica.="e.c_turno = '9'";
		break;
	case 'noche':
		$wheresincaracteristica.="e.c_turno = '7'";
		break;
	case 'doble':
		$wheresincaracteristica.="e.c_turno = '3'";
		break;
	case 'otro':
		$wheresincaracteristica.="e.c_turno = '15'";
		break;
	case 'ninguno':
		$wheresincaracteristica.="(e.c_turno != '6' and e.c_turno != '9' and e.c_turno != '7' and e.c_turno != '3' and e.c_turno != '15')";
		break;
}

if($jornada != 'todo' and $wheresincaracteristica != "WHERE "){
	$wheresincaracteristica.=" and ";
}

switch ($jornada) {
	case 'todo':
		$wheresincaracteristica.="";
		break;
	case 'completa':
		$wheresincaracteristica.="f.c_jornada = '2'";
		break;
	case 'extendida':
		$wheresincaracteristica.="f.c_jornada = '4'";
		break;
}

if($ambito != 'todo' and $wheresincaracteristica != "WHERE "){
	$wheresincaracteristica.=" and ";
}

switch ($ambito) {
	case 'todo':
		$wheresincaracteristica.="";
		break;
	case 'rural':
		$wheresincaracteristica.="b.c_ambito = '2' or b.c_ambito = 3 or b.c_ambito = '4'";
		break;
	case 'urbano':
		$wheresincaracteristica.="b.c_ambito = '1'";
		break;
}

if($gestion != 'todo' and $wheresincaracteristica != "WHERE "){
	$wheresincaracteristica.=" and ";
}

switch ($gestion) {
	case 'todo':
		$wheresincaracteristica.="";
		break;
	case 'estatal':
		$wheresincaracteristica.="a.c_sector = '1'";
		break;
	case 'privado':
		$wheresincaracteristica.="a.c_sector = '2'";
		break;
	case 'social':
		$wheresincaracteristica.="a.c_sector = '3'";
		break;
}

if($idioma != 'todo' and $wheresincaracteristica != "WHERE "){
	$wheresincaracteristica.=" and ";
}

switch ($idioma) {
	case 'todo':
		$wheresincaracteristica.="";
		break;
	case 'ingles':
		$wheresincaracteristica.="l.c_idioma = '1'";
		break;
	case 'frances':
		$wheresincaracteristica.="l.c_idioma = '2'";
		break;
	case 'portugues':
		$wheresincaracteristica.="l.c_idioma = '3'";
		break;
	case 'italiano':
		$wheresincaracteristica.="l.c_idioma = '4'";
		break;
	case 'aleman':
		$wheresincaracteristica.="l.c_idioma = '5'";
		break;
	case 'hebreo':
		$wheresincaracteristica.="l.c_idioma = '6'";
		break;
	case 'indigena':
		$wheresincaracteristica.="l.c_idioma = '8'";
		break;
	case 'otro':
		$wheresincaracteristica.="(l.c_idioma != '1' and l.c_idioma != '2' and l.c_idioma != '3' and l.c_idioma != '4' and l.c_idioma != '5' and l.c_idioma != '6' and l.c_idioma != '8')";
		break;
}

//primer caracteristica

switch ($biblioteca) {
	case 'todo':
		$whereprimercaracteristica.="";
		break;
	case 'si':
		$whereprimercaracteristica.="j.c_caracteristica = '338'";
		break;
	case 'no':
		$whereprimercaracteristica.="j.c_caracteristica = '339'";
		break;
}

//segunda caracteristica

switch ($laboratorio) {
	case 'todo':
		$wheresegundacaracteristica.="";
		break;
	case 'si':
		$wheresegundacaracteristica.="j.c_caracteristica = '211'";
		break;
	case 'no':
		$wheresegundacaracteristica.="j.c_caracteristica = '212'";
		break;
}

//tercer caracteristica

switch ($conexionint) {
	case 'todo':
		$whereterceracaracteristica.="";
		break;
	case 'si':
		$whereterceracaracteristica.="j.c_caracteristica = '131'";
		break;
	case 'no':
		$whereterceracaracteristica.="j.c_caracteristica = '132'";
		break;
}


$query= "";


$query .= "SELECT DISTINCT result.cueanexo as cueanexo 
FROM (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion, e.descripcion as turno, f.c_jornada as jornada, a.c_sector as gestion, j.c_caracteristica as cod_caracteristica, l.c_idioma as idioma
	FROM ra2020.establecimiento a
	FULL JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	FULL JOIN ra2020.oferta_dictada c ON b.id_localizacion = c.id_localizacion
	--turno
	FULL JOIN ra2020.horario d ON c.id_oferta_dictada = d.id_oferta_dictada
	FULL JOIN codigos.turno_tipo e ON d.c_turno = e.c_turno
	--jornada	
	FULL JOIN ra2020.jornada f ON c.id_oferta_dictada = f.id_oferta_dictada
	-- caracteristicas
	FULL JOIN ra2020.caracteristicas j ON b.id_localizacion = j.id_localizacion
	--idioma
	FULL JOIN (SELECT id_oferta_dictada, c_idioma FROM ra2020.idioma 
		  UNION 
		  SELECT  id_oferta_dictada, c_idioma FROM ra2020.idiomas_dictan) AS l ON c.id_oferta_dictada = l.id_oferta_dictada
	 $wheresincaracteristica
	ORDER BY cueanexo) as result";

if($whereprimercaracteristica != "WHERE "){
	$query .= " JOIN (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion 
	FROM ra2020.establecimiento a
	FULL JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	-- caracteristicas
	FULL JOIN ra2020.caracteristicas j ON b.id_localizacion = j.id_localizacion
	$whereprimercaracteristica
	ORDER BY cueanexo) as resultprimercaracteristica ON resultprimercaracteristica.id_localizacion = result.id_localizacion";
}

if($wheresegundacaracteristica != "WHERE "){
	$query .=  " JOIN (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion 
	FROM ra2020.establecimiento a
	FULL JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	-- caracteristicas
	FULL JOIN ra2020.caracteristicas j ON b.id_localizacion = j.id_localizacion
	$wheresegundacaracteristica
	ORDER BY cueanexo) as resultsegundacaracteristica ON resultsegundacaracteristica.id_localizacion = result.id_localizacion";
}

if($whereterceracaracteristica != "WHERE "){
	$query .= " JOIN (SELECT CONCAT(cue,anexo) as cueanexo, b.id_localizacion 
	FROM ra2020.establecimiento a
	FULL JOIN ra2020.localizacion b ON a.id_establecimiento = b.id_establecimiento
	-- caracteristicas
	FULL JOIN ra2020.caracteristicas j ON b.id_localizacion = j.id_localizacion
	$whereterceracaracteristica
	ORDER BY cueanexo) as resultterceracaracteristica ON resultterceracaracteristica.id_localizacion = result.id_localizacion";	
}

$query .= " WHERE result.cueanexo != '' ORDER BY result.cueanexo";

if ($conn) {
	if($selected == true and $nombrecapa != ''){
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
		} else {
			echo json_encode("errornoconsulta");	
		}
	} else if($selected == false){
		echo json_encode("errornoselected");
	} else if($nombrecapa == ''){
		echo json_encode("errornonombre");
	}
}


if ($conn) {
	pg_close($conn);
}

?>