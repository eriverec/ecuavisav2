<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Definir la URL y el cuerpo del envío
$url = 'https://api.sendpulse.com/oauth/access_token';
$data = array(
  'grant_type' => 'client_credentials',
  'client_id' => 'c79f7382012df0ea4c6fa37afec6374e',
  'client_secret' => '164551af334e1ec93e1b3099afd93a88'
);
$headers = array(
  'Content-Type: application/json',
  'Accept: application/json'
);

// Inicializar curl y configurar la solicitud
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Ejecutar la solicitud y obtener la respuesta
$response = curl_exec($ch);

// Verificar si hubo algún error
if ($response === false) {
  echo 'Error de curl: ' . curl_error($ch);
}

// Decodificar la respuesta y obtener el token de acceso
$responseData = json_decode($response);
if(isset($responseData->access_token)){
$access_token = $responseData->access_token;
// Imprimir el access_token
echo $access_token;
}

// Cerrar la conexión curl
curl_close($ch);