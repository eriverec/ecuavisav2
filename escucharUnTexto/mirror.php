<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Lee el archivo .json
$data = file_get_contents('https://estadisticas.ecuavisa.com/sites/services/global/urlObjetos.json');

// Devuelve los datos leídos en formato JSON
echo json_encode(json_decode($data));
?>