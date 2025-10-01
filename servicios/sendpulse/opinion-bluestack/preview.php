<?php
/**
 * Description of Conexion
 *
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');
require './SendPulse.php';
$c = new SendPulse();
// echo json_encode($c->getNotasNewTemplate('https://www.ecuavisa.com/rss/boletin-diario.json'));
$c->view();
