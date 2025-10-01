<?php
/**
 * Description of Conexion
 *
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

require './SendPulse.php';
$c = new SendPulse();
// // echo json_encode($c->getNotasNewTemplate('https://www.ecuavisa.com/rss/boletin-diario.json'));
$c->getJsonId();