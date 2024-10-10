<?php
// Permitir solicitudes POST desde cualquier origen y configurar los encabezados para CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el contenido JSON enviado desde el cliente
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Verificar que los campos necesarios están presentes en la solicitud
    if (isset($input['data']['estado'], $input['data']['contenido'], $input['data']['url'])) {
        // Ruta del archivo JSON a actualizar
        $jsonFile = 'data.json';

        // Leer el archivo JSON actual
        $currentData = file_get_contents($jsonFile);
        $currentDataArray = json_decode($currentData, true);

        // Actualizar los campos necesarios
        $currentDataArray['data']['estado'] = $input['data']['estado'];
        $currentDataArray['data']['contenido'] = $input['data']['contenido'];
        $currentDataArray['data']['url'] = $input['data']['url'];

        // Guardar los nuevos datos en el archivo JSON
        $updatedJson = json_encode($currentDataArray, JSON_PRETTY_PRINT);
        file_put_contents($jsonFile, $updatedJson);

        // Responder con éxito
        echo json_encode(['success' => 'Datos actualizados correctamente']);
    } else {
        // Si faltan campos, devolver un error
        echo json_encode(['error' => 'Campos faltantes']);
    }
} else {
    // Si la solicitud no es POST, devolver un error
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido']);
}
?>
