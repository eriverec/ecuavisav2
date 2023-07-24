<?php
/**
 * Description of Conexion
 *
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');
require './Subject.php';
$c = new Subject();
$c->view();
