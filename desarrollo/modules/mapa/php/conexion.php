<?php

	$host = "localhost";
	$port = "5432"
	$dbname = "ra2020";
	$username = "postgres";
	$password = "admin";

	$conn = pg_connect("host=$host port=$port dbname=$dbname user=$username password=$password");
	echo "credenciales DBmapa establecidas"
?>