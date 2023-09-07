<?php
/**
 * Description of Conexion
 *
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');
setlocale(LC_TIME, 'es_ES');
require './SendPulse.php';
$c = new SendPulse();
$c->get();
