<?php
class Subject {

	private $token;
	private $sender_email;
	private $fecha;
	private $listaUsuario;
	private $nombreNeswletter;

	function __construct(){
		header('Content-type: application/json');
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
		header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    }

    private function edit($subject, $descripcion, $id, $pass, $fecha){
    	// Ruta al archivo JSON
		$rutaArchivo = './../../boletines.json';
		// Leer el contenido del archivo JSON
		$contenidoJSON = file_get_contents($rutaArchivo);
		// Decodificar el contenido JSON en un array asociativo
		$datos = json_decode($contenidoJSON, true);
		$existe = false;

		foreach ($datos as $key => &$value) {
			if($value["id"] == $id){
				if($value["pass"] == $pass	){
					$value["subject"] = $subject;
					$value["descripcion"] = $descripcion;
					$value["edit_at"] = $fecha;
					$existe = true;
				}
			}
		}

		if($existe){
			$directorio = "./../../";
			$nombre_archivo = $directorio."boletines.json";
			file_put_contents($nombre_archivo, json_encode($datos));
			return $subject;
		}
		return null;
    }

    private function pass($pass, $id = 1){
    	// Ruta al archivo JSON
		$rutaArchivo = './../../boletines.json';
		// Leer el contenido del archivo JSON
		$contenidoJSON = file_get_contents($rutaArchivo);
		// Decodificar el contenido JSON en un array asociativo
		$datos = json_decode($contenidoJSON, true);
		$existe = false;

		foreach ($datos as $key => &$value) {
			if($value["id"] == $id){
				$value["pass"] = $pass;
				$existe = true;
			}
		}

		if($existe){
			$directorio = "./../../";
			$nombre_archivo = $directorio."boletines.json";
			file_put_contents($nombre_archivo, json_encode($datos));
			return $pass;
		}
		return null;
    }

    private function get($id){
    	// Ruta al archivo JSON
		$rutaArchivo = './../../boletines.json';
		// Leer el contenido del archivo JSON
		$contenidoJSON = file_get_contents($rutaArchivo);
		// Decodificar el contenido JSON en un array asociativo
		$datos = json_decode($contenidoJSON, true);
		$existe = false;

		foreach ($datos as $key => $value) {
			if($value["id"] == $id){
				return $value;
			}
		}
		return null;
    }

    private function getAll(){
    	// Ruta al archivo JSON
		$rutaArchivo = './../../boletines.json';
		// Leer el contenido del archivo JSON
		$contenidoJSON = file_get_contents($rutaArchivo);
		// Decodificar el contenido JSON en un array asociativo
		// $datos = json_decode($contenidoJSON, true);
		// $existe = false;

		// foreach ($datos as $key => $value) {
		// 	if($value["id"] == $id){
		// 		return $value;
		// 	}
		// }
		// return null;
		return $contenidoJSON;
    }

    private function generarNumeroRandom() {
	   $numero = rand(0, 10000) / 100; // Genera un número aleatorio entre 0 y 10000 y lo divide por 100
	   $numero = round($numero, 2); // Redondea el número a 2 decimales
	   return $numero;
	}

	private function cropImagen($url = "https://www.ecuavisa.com/binrepository/barbie-ken-ecuavisa_1058738_20230725181857.jpg", $newWidth = 600, $newHeight = 400, $verticalPosition = 'arriba') {
	    $imagePath = './../../../img/boletin-diario/'; // Ruta donde se guardarán las imágenes

	    // Obtener la fecha actual
	    $currentDate = date("Y/m/d");
	    $currentYear = date("Y");
	    $currentMonth = date("m");

	    // Crear carpetas si no existen
	    if (!file_exists($imagePath . $currentYear)) {
	        mkdir($imagePath . $currentYear);
	    }
	    if (!file_exists($imagePath . $currentYear . '/' . $currentMonth)) {
	        mkdir($imagePath . $currentYear . '/' . $currentMonth);
	    }

	    // Obtener el nombre de la imagen a partir de la URL
	    $imageName = basename($url);
	    $imageFilePath = $imagePath . $currentYear . '/' . $currentMonth . '/' . $imageName;

	    // Verificar si la imagen ya existe en la ruta
	    if (!file_exists($imageFilePath)) {
	        // La imagen no existe, crearla a partir de la URL
	        $image = imagecreatefromstring(file_get_contents($url));
	        $originalWidth = imagesx($image);
	        $originalHeight = imagesy($image);

	        // Calcular el factor de zoom para ajustar la imagen dentro del área sin dejar fondo negro
	        $zoomFactor = max($newWidth / $originalWidth, $newHeight / $originalHeight);

	        // Calcular las dimensiones finales de la imagen con el zoom
	        $finalWidth = $originalWidth * $zoomFactor;
	        $finalHeight = $originalHeight * $zoomFactor;

	        // Crear una imagen en blanco del tamaño requerido para aplicar el recorte y zoom
	        $cropped_image = imagecreatetruecolor($newWidth, $newHeight);

	        // Calcular las coordenadas para centrar el recorte horizontal
	        $start_x = ($finalWidth - $newWidth) / -2;

	        // Calcular las coordenadas para el recorte vertical
	        if ($verticalPosition === 'arriba') {
	            $start_y = 0;
	        } elseif ($verticalPosition === 'abajo') {
	            $start_y = $finalHeight - $newHeight;
	        } else {
	            // Vertical centrada (valor por defecto)
	            $start_y = ($finalHeight - $newHeight) / 2;
	        }

	        // Copiar y recortar la imagen con el zoom aplicado
	        imagecopyresampled($cropped_image, $image, $start_x, $start_y, 0, 0, $finalWidth, $finalHeight, $originalWidth, $originalHeight);

	        // Obtener la extensión de la imagen
	        $extension = strtolower(pathinfo($imageFilePath, PATHINFO_EXTENSION));

	        // Comprimir y guardar la imagen en la ruta especificada según su extensión
	        if ($extension === 'jpg' || $extension === 'jpeg') {
	            imagejpeg($cropped_image, $imageFilePath, 75); // Calidad JPEG: 75 (valor entre 0 y 100)
	        } elseif ($extension === 'png') {
	            imagepng($cropped_image, $imageFilePath);
	        }

	        // Liberar memoria
	        imagedestroy($image);
	        imagedestroy($cropped_image);
	    }

	    // Obtener la nueva URL de la imagen
	    $src_url = $imagePath . $currentYear . '/' . $currentMonth . '/' . $imageName;
	    return $src_url . "?v=" . $this->generarNumeroRandom();
	}
	
    public function view(){
    	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    		$getFecha = date("Y-m-d, H:i:s", time());
    		$post = (object) $_POST;
    		if(isset($post->action)){
    			switch ($post->action) {
    				case 'edit':
    					echo json_encode($this->edit($post->subject,$post->descripcion, $post->id, $post->pass, $getFecha));
        				exit();
    					break;
    				default:
    					// code...
    					break;
    			}
    		}
    		echo 'null';
	        exit();
    	}

    	if(isset($_GET["all"])){
    		echo $this->getAll();
        	exit();
    	}

    	if(isset($_GET["id"]) && !isset($_GET["pass"])){
    		if($_GET['id'] != ""){
    			echo json_encode($this->get($_GET["id"]));
        		exit();
    		}
    	}

    	if(isset($_GET["pass"])){
    		if(!isset($_GET["id"])){
    			echo "No tienes acceso";
    			exit();
    		}
    		if($_GET['pass'] != ""){
    			echo json_encode($this->pass($_GET["pass"], $_GET["id"]));
        		exit();
    		}
    	}

    	echo "No tienes acceso";
    	exit();
    }
}

