<?php
/**
 * Description of Conexion
 *
 * @author ecuavisa.ec
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');

// Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Origin: *');

// Asegurar que las solicitudes preflight puedan pasar
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, Accept');
    header('Access-Control-Max-Age: 86400'); // Almacena en caché la respuesta preflight durante un día
    exit(0);
}

// Permitir el tipo de contenido JSON
header('Content-type: application/json; charset=UTF-8');

// Manejar solo solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['message' => 'Método no permitido']);
    exit;
}

require './../app/controllers/Log.php';

$c = new Log();
echo json_encode($c->addDatos());
exit();