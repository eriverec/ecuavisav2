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

    private function edit($subject, $id, $pass, $fecha){
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

    public function view(){
    	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    		$getFecha = date("Y-m-d, h:i:s", time());
    		$post = (object) $_POST;
    		if(isset($post->action)){
    			switch ($post->action) {
    				case 'edit':
    					echo json_encode($this->edit($post->subject, $post->id, $post->pass, $getFecha));
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

