<?php
function sendApiEmails() {
    // URL de la API para obtener los usuarios filtrados
    $apiUrl = "https://mongo-users-drab.vercel.app/usuario/sendpulse";
  
    // Obtener los usuarios filtrados
    $response = file_get_contents($apiUrl);
    $filteredUsers = json_decode($response, true);
  
    // Verificar si se obtuvo una respuesta válida
    if (!$filteredUsers) {
        echo "Error al obtener los datos de la API.";
        return;
    }
  
    // Tamaño del lote
    $batchSize = 1000;
  
    // Dividir los usuarios filtrados en lotes de 1000
    $totalEmails = count($filteredUsers);
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
      
        // Imprimir el array en la consola
        // echo "<pre>";
        // print_r($emailData);
        // echo "</pre>";
      
        // Realizar el envío de correo del lote actual
    }
    sendEmailsBatch($emailData);
}

function sendEmailsBatch($emails) {
    // URL para obtener el token de autenticación
    $tokenUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php";
  
    // Obtener el token
    $token = file_get_contents($tokenUrl);
  
    // Verificar si se obtuvo un token válido
    if (!$token) {
        echo "Error al obtener el token.";
        return;
    }
  
    $idListaSendpulse = "574818";
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
    echo $response;
}

sendApiEmails();
?>
