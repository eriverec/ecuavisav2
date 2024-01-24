<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
    echo '{"resp":false,"message":"Solo es permitido consultas por POST!"}';
    exit();
}

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

function sendApiEmails($usuario) {
    // URL de la API para obtener los usuarios filtrados
    // $apiUrl = "https://mongo-users-drab.vercel.app/usuario/sendpulse/?fechai=2023-08-11";
    // $apiUrl = "https://mongo-users-drab.vercel.app/usuario/sendpulse";
    
    // Obtener los usuarios filtrados
    // $response = file_get_contents($apiUrl);

    $filteredUsers = [$usuario];
    // Verificar si se obtuvo una respuesta válida
    if (!$filteredUsers) {
        echo '{"resp":"Error al obtener los datos de la API."}';
        exit();
    }
    // Tamaño del lote
    $batchSize = 5000;

    // Dividir los usuarios filtrados en lotes de 1000
    $totalEmails = count($filteredUsers);
    // Obtener el token de autenticación
    $token = getToken();
    for ($i = 0; $i < $totalEmails; $i += $batchSize) {
        $batch = array_slice($filteredUsers, $i, $batchSize);
        // Array para almacenar los correos y sus datos
        $emailData = [];
        // Recorrer los usuarios del lote actual y agregar los datos al array
        foreach ($batch as $user) {
            $email = $user['email'];
            $firstName = $user['first_name'];
            $lastName = $user['last_name'];
            $createdAt = $user['created_at'];

            $userData = [
                'email' => $email,
                'variables' => [
                    'Nombre' => $firstName,
                    'Apellido' => $lastName,
                    'created_at' => $createdAt
                ]
            ];
            $emailData[] = $userData;
        }
        
        // Realizar el envío de correo del lote actual
        return sendEmailsBatch($emailData, $token);
    }
}

function getToken() {
    // URL para obtener el token de autenticación
    $tokenUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php";
    // Obtener el token
    $token = file_get_contents($tokenUrl);
    // Verificar si se obtuvo un token válido
    if (!$token) {
        echo "Error al obtener el token.";
        return;
    }
    return $token;
}

function sendEmailsBatch($emails, $token) {
    $idListaSendpulse = "589349";
    $listEmails = $idListaSendpulse;
    $sendEmailsUrl = "https://api.sendpulse.com/addressbooks/{$listEmails}/emails";
    
    // Configurar la petición HTTP
    $headers = [
        "Content-Type: application/json",
        "Authorization: Bearer {$token}"
    ];
    $postData = json_encode(['emails' => $emails]);
    $options = [
        'http' => [
            'header' => implode("\r\n", $headers),
            'method' => 'POST',
            'content' => $postData,
            'ignore_errors' => true
        ]
    ];
    // Realizar la petición HTTP
    $context = stream_context_create($options);
    $response = file_get_contents($sendEmailsUrl, false, $context);
    // Imprimir la respuesta en la consola
    return $response;
}

echo '{"resp":true,"message":"Datos guardados correctamente", "respConsulta":'.sendApiEmails($data).', "usuarioEnviado": '.json_encode($data).'}';
exit();