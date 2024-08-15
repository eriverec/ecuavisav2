<?php
// Ruta del archivo JSON que almacenará el tiempo
define('TIME_FILE', 'time.json');

// Función para leer el tiempo del archivo JSON
function readTimeFromFile() {
    if (!file_exists(TIME_FILE)) {
        return ['time' => null];
    }
    
    $data = file_get_contents(TIME_FILE);
    return json_decode($data, true);
}

// Función para escribir el tiempo en el archivo JSON
function writeTimeToFile($timeData) {
    $json_data = json_encode($timeData);
    file_put_contents(TIME_FILE, $json_data);
}

// Obtiene el valor del parámetro 'action'
$action = isset($_GET['action']) ? $_GET['action'] : null;

// Manejo del método POST y acción 'write'
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'write') {
        // Obtiene el cuerpo de la solicitud y decodifica el JSON
        $input = json_decode(file_get_contents('php://input'), true);

        // Verifica que la propiedad 'time' esté presente en la solicitud
        if (isset($input['time'])) {
            // Escribe la propiedad 'time' en el archivo JSON
            writeTimeToFile(['time' => $input['time']]);
            
            // Respuesta exitosa
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success']);
        } else {
            // Respuesta de error
            header('Content-Type: application/json', true, 400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        }
    } else {
        // Si la acción no es 'write', enviar un error
        header('Content-Type: application/json', true, 405);
        echo json_encode(['status' => 'error', 'message' => 'Metodo no permitido, use POST con action=write']);
    }
}

// Manejo del método GET y acción 'read'
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'read') {
        // Lee el tiempo del archivo JSON
        $timeData = readTimeFromFile();

        // Respuesta con el valor de 'time'
        header('Content-Type: application/json');
        echo json_encode($timeData);
    } else {
        // Si la acción no es 'read', enviar un error
        header('Content-Type: application/json', true, 405);
        echo json_encode(['status' => 'error', 'message' => 'Metodo no permitido, use GET con action=read']);
    }
} else {
    // Si el método no es ni GET ni POST, enviar un error
    header('Content-Type: application/json', true, 405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
