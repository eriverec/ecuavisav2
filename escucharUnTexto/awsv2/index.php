<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Lee el archivo .json
if(!isset($_GET["parte"])){
    if ($_GET["parte"]=='') {
        echo '{"resp":false, "msj":"no se mandó la parte del artículo"}';
        exit();
    }
}

if(isset($_GET["id"])){
	if ($_GET["id"]!='') {
		if (!file_exists("./idaudio/".$_GET['id'].".json")) {
		    echo '{"resp":false, "msj":"El artículo no existe"}';
			exit();
		}
		$data = json_decode(file_get_contents("./idaudio/".$_GET['id'].".json"));
		// Devuelve los datos leídos en formato JSON
		if(array_key_exists($_GET["parte"], $data->base64)){
		    echo json_encode([
				"resp"=> true,
				"data" => $data->base64[$_GET["parte"]],
				"tamanioBase64" => count($data->base64),
				"part" => $_GET["parte"],
				"totalPartes" => $data->totalPartes
			]);
			exit();
		}else{
		    echo json_encode([
				"resp"=> false,
				"msj" => "No exise el artículo",
				"tamanioBase64" => count($data->base64),
				"totalPartes" => $data->totalPartes,
			]);
			exit();
		}
	}
}

echo '{"resp":false, "msj":"Error desconocido"}';
exit();
?>