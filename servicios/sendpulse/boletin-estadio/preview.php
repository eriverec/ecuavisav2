<?php
/**
 * Description of Conexion
 *
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
// date_default_timezone_set('UTC');
date_default_timezone_set('America/Guayaquil');
// echo 'Zona horaria actual: ' . date_default_timezone_get() . "<br>";
// echo 'Hora actual: ' . date('Y-m-d H:i:s');

// echo 'Zona horaria actual: ' . date_default_timezone_get() . "<br>";
// echo 'Hora actual (formato normal): ' . date('Y-m-d H:i:s') . "<br>";
// echo 'Hora actual (ISO 8601): ' . date('c') . "<br>";

require './SendPulse.php';
$c = new SendPulse();
// echo json_encode($c->getNotasNewTemplate('https://www.ecuavisa.com/rss/boletin-diario.json'));
$c->view();
