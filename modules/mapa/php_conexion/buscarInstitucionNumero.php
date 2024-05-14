<?php
include 'conexion.php';
session_start();
// Verificar si se recibió una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Realizar consulta para obtener la institucion
        $numueroEsc = $_POST['numero']
        $consulta = pg_query($conexion, "SELECT * FROM padron.institucion WHERE institucion.numero LIKE $numueroEsc");
        if ($consulta){
            $institucion = pg_fetch_all($consulta);
        }
        // Responder con los datos en formato JSON
        header('Content-Type: application/json');
        echo json_encode($institucion);
        // Cerrar la conexión
        pg_close($conexion);
        exit;
}
?>