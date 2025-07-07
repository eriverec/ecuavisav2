<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Guayaquil');

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

if (strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0) {
    echo json_encode([
        "resp" => false,
        "message" => "Solo se permiten consultas por POST"
    ]);
    exit;
}

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

// Validar si $data es válido
if (!$data || !is_array($data)) {
    echo json_encode([
        "resp" => false,
        "message" => "Datos JSON inválidos o vacíos"
    ]);
    exit;
}

function sendApiEmails($usuario)
{
    $filteredUsers = [$usuario];
    if (!$filteredUsers) {
        return ["success" => false, "error" => "No se encontraron usuarios válidos"];
    }

    $batchSize = 5000;
    $totalEmails = count($filteredUsers);
    $token = getToken();

    if (!$token) {
        return ["success" => false, "error" => "Token inválido o no disponible"];
    }

    $results = [];

    for ($i = 0; $i < $totalEmails; $i += $batchSize) {
        $batch = array_slice($filteredUsers, $i, $batchSize);
        $emailData = [];

        foreach ($batch as $user) {
            $emailData[] = [
                'email' => $user['email'],
                'variables' => [
                    'Nombre' => $user['first_name'],
                    'Apellido' => $user['last_name'],
                    'created_at' => $user['created_at']
                ]
            ];
        }

        $response = sendEmailsBatch($emailData, $token);
        $results[] = json_decode($response, true);
    }

    return $results;
}

function getToken()
{
    $tokenFile = __DIR__ . '/sendpulse/getApi.php';

    if (!file_exists($tokenFile)) {
        return null;
    }

    $token = file_get_contents($tokenFile);

    if (!$token || empty(trim($token))) {
        return null;
    }

    return trim($token);
}

function sendEmailsBatch($emails, $token)
{
    $idListaSendpulse = "659525";
    $sendEmailsUrl = "https://api.sendpulse.com/addressbooks/{$idListaSendpulse}/emails";

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

    $context = stream_context_create($options);
    return file_get_contents($sendEmailsUrl, false, $context);
}

// Ejecutar y devolver respuesta final
$apiResult = sendApiEmails($data);

echo json_encode([
    "resp" => true,
    "message" => "Datos guardados correctamente",
    "respConsulta" => $apiResult,
    "usuarioEnviado" => $data
]);
exit;
