<?php

// Manejo de las solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');
    header('Access-Control-Max-Age: 86400');
    exit(0);
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (isset($input['modals'])) {
        $jsonFile = 'listmodals.json';
        $currentData = file_get_contents($jsonFile);
        $currentDataArray = json_decode($currentData, true);

        // Reemplazar los datos de modals con los nuevos datos
        $currentDataArray['modals'] = $input['modals'];

        // Guardar los nuevos datos en el archivo JSON
        $updatedJson = json_encode($currentDataArray, JSON_PRETTY_PRINT);
        file_put_contents($jsonFile, $updatedJson);

        echo json_encode(['success' => 'Datos actualizados correctamente']);
    } else {
        echo json_encode(['error' => 'Campos faltantes']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
}
?>
