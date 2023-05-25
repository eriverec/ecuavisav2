<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
// Recuperar los datos de la petición POST
$postdata = file_get_contents("php://input");

// Decodificar el JSON enviado
$data = json_decode($postdata, true);

// Procesar los datos para obtener el id y el base64
$id = $data[0]['id'];
$base64 = $data[0]['base64'];

// Leer el archivo JSON existente
$file = 'datos.json';
$json = file_get_contents($file);
$items = json_decode($json, true);

// Buscar si el ID existe en el archivo JSON
$found = false;
foreach ($items as $key => $item) {
    if ($item['id'] == $id) {
        $found = true;
        // Si el ID existe, actualizar el registro existente
        $items[$key]['base64'] = $base64;
        break;
    }
}

// Si el ID no existe, agregar un nuevo registro
if (!$found) {
    array_push($items, array('id' => $id, 'base64' => $base64));
}

// Codificar los datos en JSON y guardarlos en el archivo
$json = json_encode($items);
file_put_contents($file, $json);

// Confirmación de que los datos han sido guardados exitosamente
echo "Datos guardados correctamente en " . $file;
?>