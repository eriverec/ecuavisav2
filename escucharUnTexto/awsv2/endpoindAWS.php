<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
// Recuperar los datos de la petición POST
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
    echo '{"resp":false,"message":"Solo es permitido consultas por POST!"}';
    exit();
}

// Lee el archivo .json
if(!isset($_GET["parte"])){
    if ($_GET["parte"]=='') {
        echo '{"resp":false, "msj":"no se mandó la parte del artículo"}';
        exit();
    }
}

$postdata = file_get_contents("php://input");

// Decodificar el JSON enviado
$data = json_decode($postdata, true);

// Procesar los datos para obtener el id y el base64
$id = $data['id'];
$base64 = $data['base64'];
$totalPartes = $data['totalPartes'];
$parte = $_GET["parte"];
$fechahoy = date("Y-m-d h:i:s", time());

// Leer el archivo JSON existente
$file = './idaudio/'.$id.'.json';
$idarticulo = $id;
if (!file_exists($file)) {
    file_put_contents($file, json_encode([
        "id" => $id,
        "base64" => [],
        "time" => $fechahoy,
        "totalPartes" => $totalPartes,
    ]));
}

$json = file_get_contents($file);
$items = json_decode($json, true);

if(array_key_exists($parte, $items["base64"])){
    $items["base64"][$parte] =  [
        "audioBase64" => $base64,
        "encode" => false,
        "totalPartes" => $totalPartes,
    ];
}else{
    $items["base64"][] =  [
        "audioBase64" => $base64,
        "encode" => false,
        "totalPartes" => $totalPartes,
    ];
}

// Codificar los datos en JSON y guardarlos en el archivo
$json = json_encode($items);
file_put_contents($file, $json);

// Confirmación de que los datos han sido guardados exitosamente
echo '{"resp":true,"message":"Datos guardados correctamente en: '.$file.'"}';
exit();
?>