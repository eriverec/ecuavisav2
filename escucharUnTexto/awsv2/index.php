<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Lee el archivo .json
if(isset($_GET["id"])){
	if ($_GET["id"]!='') {
		if (!file_exists("./idaudio/".$_GET['id'].".json")) {
		    echo '{"resp":false, "msj":1}';
			exit();
		}

		$data = file_get_contents("./idaudio/".$_GET['id'].".json");
		// Devuelve los datos leídos en formato JSON
		echo json_encode([
			"resp"=> true,
			"data" => json_decode($data)
		]);
		exit();
	}
}

echo '{"resp":false, "msj":2}';
exit();
?>