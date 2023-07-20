<?php
class SendPulse {

	private $token;
	private $sender_email;

	function __construct(){

    }

	public function initToken(){
		return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJlOThlNDFkNjlmNTRlODY1ODMwNjEyMzlmMThhNzIzNWRlMjhhMGQ4ZWFiN2E5OTg4YWQyZmFjYTg0NThkMDU2OWVjYmIxOWNkNDIwMjNjIn0.eyJhdWQiOiJjNzlmNzM4MjAxMmRmMGVhNGM2ZmEzN2FmZWM2Mzc0ZSIsImp0aSI6IjJlOThlNDFkNjlmNTRlODY1ODMwNjEyMzlmMThhNzIzNWRlMjhhMGQ4ZWFiN2E5OTg4YWQyZmFjYTg0NThkMDU2OWVjYmIxOWNkNDIwMjNjIiwiaWF0IjoxNjg5ODc1MDI1LCJuYmYiOjE2ODk4NzUwMjUsImV4cCI6MTY4OTg3ODYyNSwic3ViIjoiIiwic2NvcGVzIjpbXSwidXNlciI6eyJpZCI6Nzg0NDUzOCwiZ3JvdXBfaWQiOm51bGwsInBhcmVudF9pZCI6bnVsbCwiY29udGV4dCI6eyJhY2NsaW0iOiIwIn0sImFyZWEiOiJyZXN0In19.wGBgvpbcdiXs63TWJYQlNZX55z_cLc-AnW2ZRJBZZrRjX06zyrHSoZ5m3xuZuz25ibgLol4G-jQ_o3q075CKeVRu-QUkClcucvlqif5oTe6gfyOJ41dbJ4zrqrFCmO_uH0G31Iirws85JJcpouJiY9TiBRZbSFaRI5sYxZtA-wx396u2yrYXoRTWwPSE6ZEgeSPDtf3g5OSKEej-z2j6TyvUzOq_7PGM8yhUBYig2YdExt4PMAa6g2la84Sm-pGhQX3Bvga3v_3Msn3pa8g8je1lyRnvTfjY6U8dzKTCfkMRZHGYJrB-2F4dHzeNjxRJabiOqw7lQH4FhUVCCXLH_w";
        $this->sender_email = "suscripciones@ecuavisa.com";
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.sendpulse.com/oauth/access_token',
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS =>'{
		   "grant_type":"client_credentials",
		   "client_id":"c79f7382012df0ea4c6fa37afec6374e",
		   "client_secret":"164551af334e1ec93e1b3099afd93a88"
		}',
		  CURLOPT_HTTPHEADER => array(
		    'Content-Type: application/json'
		  ),
		));

		$response = curl_exec($curl);

		curl_close($curl);

		return json_decode($response)->access_token;
    }

    public function getToken(){
    	return $this->initToken();
    }

    public function base64ToHTML($base64){
        return base64_decode($base64);
    }

    public function HtmlToBase64($html){
        return base64_encode($html);
    }

    public function getTemplate($id=146792){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.sendpulse.com/template/'.$id,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'GET',
		  CURLOPT_HTTPHEADER => array(
		    'Authorization: Bearer '.$this->getToken()
		  ),
		));

		$response = curl_exec($curl);
		curl_close($curl);
		return json_decode($response);
    }

    public function generarIDUnico($texto = "user") {
	    $uniqid = uniqid();
	    $idUnico = $texto . "_" . $uniqid;
	    return $idUnico;
	}

	public function getTemplatePHP(){
    	$datos = [
    		"notas" => [
    			"nombre" => "cr", 
    			"apellid" => "crss", 
    		]
    	];
		$options = array(
		    'http' => array(
		        'method' => 'POST',
		        'header' => 'Content-type: application/x-www-form-urlencoded',
		        'content' => http_build_query($datos)
		    )
		);
		$context = stream_context_create($options);
		$content = file_get_contents("http://localhost/ecuavisa/ecuavisav2/servicios/sendpulse/json/boletin-diario/create.php", false, $context);
		echo $content;
    }

    public function create(){
    	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    		$data = file_get_contents('php://input');
		    $post = array();
		    parse_str($data, $post);
		    $post = (object) $post;

    		$directorio = "./archivos/";
    		$idUnico = $this->generarIDUnico();
    		$nombre_archivo = $directorio.$idUnico.".json";
			file_put_contents($nombre_archivo, json_encode($post->notas));
			echo '{"resp":true, "id":"'.$idUnico.'"}';
			exit();
    	}else{
    		//header("Location: https://www.ecuavisa.com/");
    		echo '{"resp":false}';
			exit();
    	}
    }

    private function obtenerMesEnEspanol($numeroMes) {
	    $mesesEnEspanol = array(
	        1 => "enero",
	        2 => "febrero",
	        3 => "marzo",
	        4 => "abril",
	        5 => "mayo",
	        6 => "junio",
	        7 => "julio",
	        8 => "agosto",
	        9 => "septiembre",
	        10 => "octubre",
	        11 => "noviembre",
	        12 => "diciembre"
	    );

	    return $mesesEnEspanol[$numeroMes];
	}

	

    public function get(){
    	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		$get = (object) $_GET;
    		$idUnico = $get->id;
    		$directorio = "./archivos/";
    		$nombre_archivo = $directorio.$idUnico.".json";
			if (!file_exists($nombre_archivo)) {
			    // header("Location: https://www.ecuavisa.com/");
			    echo '{"resp":false}';
				exit();
			}
			$json = file_get_contents($nombre_archivo);
			$items = json_decode($json, true);
			// Obtener el número del mes
			$numeroMes = date("n");
			// Obtener el nombre del mes en español
			$nombreMes = $this->obtenerMesEnEspanol($numeroMes);

			// Obtener la fecha actual con el nombre del mes en español
			echo date("d") . " de " . $nombreMes . " " . date("Y") . ", " . date("H:i:s");
			echo json_encode($items);
			exit();
    	}
    }
}

