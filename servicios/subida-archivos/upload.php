<?php
/**
 * @author
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');

header('Content-type: text/html; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, multipart/form-data');

require './app/Controllers/File.php';
$c = new File();

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	echo json_encode($c->upladFile());
	exit();
}else{
	echo json_encode(["resp" => false, "message"=>"No tienes acceso, error 001"]);
	exit();
}