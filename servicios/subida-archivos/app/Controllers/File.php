<?php

class File {
	public $folder;//CARPETA DONDE SE GUARDAN LAS IMÁGENES
	public $env;//ARCHIVO DODE SE GUARDAN LAS CLAVES
	public $maxFileSize;//CARPETA DONDE SE GUARDAN LAS IMÁGENES

	function __construct($list = array()){
		$valoresFecto = array(
			"carpeta" => "/../../uploads/" //CARPETA DONDE SE GUARDAN LAS IMÁGENES
		);
		// Fusionar el array por defecto con el array proporcionado
    	$resultado = array_merge($valoresFecto, $list);
    	$this->folder = $resultado["carpeta"];
    	$this->env = $this->readEnv();
    	$this->maxFileSize = 2 *1024 * 1024; // Tamaño máximo permitido en bytes (1 MB en este caso)
	}

	public function readEnv(){
		// Ruta al archivo .env
		$envFile = __DIR__ . '/../../.env';

		// Verificar si el archivo .env existe
		if (file_exists($envFile)) {
		    // Leer el archivo .env línea por línea
	        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	        // Iterar sobre cada línea y cargar las variables de entorno
	        foreach ($lines as $line) {
	            // Separar la línea en clave y valor usando el signo de igual como delimitador
	            list($key, $value) = explode('=', $line, 2);

	            // Limpiar los espacios en blanco y comillas alrededor de la clave y el valor
	            $key = trim($key);
	            $value = trim($value);

	            // Establecer la variable de entorno si la clave no está vacía
	            if (!empty($key)) {
	                // Guardar la clave y el valor en el array
	                $envVariables[$key] = $value;
	            }
	        }
	        return $envVariables;
		} else {
		    // Si el archivo .env no existe, mostrar un mensaje de advertencia
		    return null;
		}
	}

	public function getToken(){
	    // Datos para el token
		$data = array(
		    'CODE' => $this->env["SECRET_KEY_INIT"], // ID de usuario
		    'expiration' => time() + (60 * 60) // Tiempo de expiración (1 hora)
		);

		// Convertir los datos a JSON
		$json_data = json_encode($data);

		// Definir la clave y el IV
		$clave_secreta = $this->env["SECRET_KEY"]; // Clave secreta
		$iv = $this->env["SECRET_KEY_IV"]; // IV de 16 bytes

		// Encriptar el token utilizando AES-256-CBC
		$token = openssl_encrypt($json_data, 'aes-256-cbc', $clave_secreta, 0, $iv);
	    return $token;
	}

	public function validateToken($token){
		// Definir la clave y el IV
		$clave_secreta = $this->env["SECRET_KEY"]; // Clave secreta
		$iv = $this->env["SECRET_KEY_IV"]; // IV de 16 bytes
		
		// Desencriptar el token
		$decryptedData = openssl_decrypt($token, 'aes-256-cbc', $clave_secreta, 0, $iv);

		// Convertir los datos desencriptados de JSON a array
		$decodedData = json_decode($decryptedData, true);
		// Verificar si la decodificación fue exitosa y el token es válido
	    if ($decodedData !== null && isset($decodedData['expiration']) && isset($decodedData['CODE']) && 
	        $decodedData['expiration'] > time() && $decodedData['CODE'] == $this->env["SECRET_KEY_INIT"]) {
	        return true; // El token es válido
	    } else {
	        return false; // El token no es válido
	    }
	}

	private function getFileCategory($type){
		// Definir el array con los tipos de archivo asociados a cada categoría
		$arrayFiles = [
		    "image" => [
		        "jpg", "jpeg", "png", "gif", "bmp", "webp", "heic",
		    ],
		    "video" => [
		        "mp4", "mov", "avi", "mkv", "wmv", "flv", "3gp", "hevc",
		    ]
		];

	    foreach ($arrayFiles as $category => $types) {
	        if (in_array($type, $types)) {
	            return $category;
	        }
	    }
	    return "not_file";
	}

	private function validateFileExtension($type){
		// Definir el array con los tipos de archivo asociados a cada categoría
		$extensions = [
		    "image" => [
		        "jpg", "jpeg", "png", "gif", "bmp", "webp", "heic",
		    ],
		    "video" => [
		        "mp4", "mov", "avi", "mkv", "wmv", "flv", "3gp", "hevc",
		    ]
		];

	    foreach ($extensions as $extension => $types) {
	        if (in_array($type, $types)) {
	            // return $extension;
	            return true;
	        }
	    }

	    return false;
	}

	public function upladFile() {
	    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	        $post = (object) $_POST;
	        if (!isset($post->token) || !isset($post->idUser)) {
	            return ["resp" => false, "message" => "No tienes acceso, error 003."];
	        }

	        $token = $post->token;
	        $idUser = $post->idUser ?? 0;
	        $listError = [];
	        $listSuccess = [];
	        if ($this->validateToken($token)) {
	            // Carpeta de destino para guardar los archivos subidos
	            $uploadDirectory = __DIR__ . $this->folder;
	            // Verificar si se subieron archivos
	            if (!empty($_FILES['files']['name'][0])) {
	                // Iterar sobre cada archivo subido
	                foreach ($_FILES['files']['name'] as $key => $name) {
	                    $tmpName = $_FILES['files']['tmp_name'][$key];
	                    $fileType = $_FILES['files']['type'][$key];
	                    $fileSize = $_FILES['files']['size'][$key];
	                    $fileNameOld = basename($name);
	                    
	                    // Obtener la extensión del archivo original
	                    $fileExtension = pathinfo($name, PATHINFO_EXTENSION);

	                    if($this->validateFileExtension(strtolower($fileExtension)) && $fileSize <= $this->maxFileSize){// Solo archivos imágenes y videos
	                    	// Generar un nombre único para el archivo manteniendo la extensión original
		                    $newFileName = uniqid('', true) .'-'.$idUser. '.' . $fileExtension;
		                    $uploadPath = $uploadDirectory . $newFileName;
		                    $folderCreate = $uploadDirectory. $this->getFileCategory(strtolower($fileExtension)) . '/';
		                    // Crear carpetas si no existen
		                    if (!file_exists($folderCreate)) {
		                        mkdir($folderCreate);
		                    }

		                    $folderCreate.= $idUser."/";
		                    // Crear carpetas si no existen
		                    if (!file_exists($folderCreate)) {
		                        mkdir($folderCreate);
		                    }

		                    $newFolder = $folderCreate . $newFileName;
		                    // Mover el archivo subido a la carpeta de destino
		                    if (move_uploaded_file($tmpName, $newFolder)) {
		                        // echo "El archivo $newFileName se ha subido correctamente.<br>";
		                        // echo "Tipo: $fileType<br>";
		                        // echo "Tamaño: $fileSize bytes<br>";
		                        $listSuccess[] = [ "resp" => true, "file"=> $newFileName, "message" => "Archivo subido con éxito"];
		                    } else {
		                    	$listError[] = [ "resp" => false, "file"=> $fileNameOld, "message" => "No se pudo subir el archivo"];
		                    }
	                    }else{
	                    	$listError[] = [ "resp" => false, "file"=> $fileNameOld, "message" => "Archivo con formato no permitido o excede a 2MB de tamaño"];
	                    }
	                }
	                return ["resp" => true, "success" => $listSuccess, "error" => $listError];
	            } else {
	                return ["resp" => false, "message" => "No se han seleccionado archivos para subir."];
	            }
	        } else {
	            return ["resp" => false, "message" => "El token no es válido"];
	        }
	    } else {
	        return ["resp" => false, "message" => "No tienes acceso, error 002"];
	    }
	}


}