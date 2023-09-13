<?php
require '../vendor/autoload.php';
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
class SendPulse {

	private $token;
	private $sender_email;
	private $sender_name;
	private $fecha;
	private $fechaDeEnvio;
	private $listaUsuario;
	private $nombreNeswletter;
	private $idTemplate;
	private $subject;
	private $descripcion;
	private $horai;
	private $horaf;
	private $dataJsonNewsletter;
	private $typeProyect;
	private $apiProtec;
	private $ctrFunciones;
	private $contadorSolicitudes;
	private $jsonPDF;

	function __construct(){
		require '../funciones/Ctrfunciones.php';

		$this->typeProyect =  "Guzzle"; //Production - Guzzle
		$this->ctrFunciones = new Ctrfunciones(array(
			"desfaseMinutosMax" => 15,
			"folder" => "opinion", // Guardado de img y json
			"folderPrimary" => ($this->typeProyect == "Production" ? "sendpulse": "sendpulse"),
			"typeProyect" => $this->typeProyect
		));

    }

	private function getApiMethodGet($url){
		$this->contadorSolicitudes ++;
		if($this->typeProyect != "Production"){
			$client = new Client([
			    'verify' => 'C:/cacert.pem',
			]);

			$request = new Request('GET', $url);

			$res = $client->sendAsync($request)->wait();

			// echo $res->getBody();

			// echo json_encode($res->getBody());
			if ($res->getStatusCode() == 200) {
				return $res->getBody();
			} else {
			    return null;
			}
		}

	    $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $url,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'GET',
		));
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	private function getApiMethodGetAuthorization($url){
		$this->contadorSolicitudes ++;
		if($this->typeProyect != "Production"){
			$client = new Client([
			    'verify' => 'C:/cacert.pem',
			]);

			$headers = [
			  'Authorization' => 'Bearer '.$this->token
			];
			$request = new Request('GET', $url, $headers);
			$res = $client->sendAsync($request)->wait();
			if ($res->getStatusCode() == 200) {
				return $res->getBody();
			} else {
			    return null;
			}
		}

	    $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $url,
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

		return $response;
	}

	private function getApiMethodPost($url, $params){
		$this->contadorSolicitudes ++;
		if($this->typeProyect != "Production"){
			$client = new Client([
			    'verify' => 'C:/cacert.pem',
			]);
			$headers = [
			  'Content-Type' => 'application/json'
			];
			$body = json_encode($params);
			$request = new Request('POST', $url, $headers, $body);
			$res = $client->sendAsync($request)->wait();
			if ($res->getStatusCode() == 200) {
				return $res->getBody();
			} else {
			    return null;
			}
		}
		// '{
		//    "grant_type":"client_credentials",
		//    "client_id":"c79f7382012df0ea4c6fa37afec6374e",
		//    "client_secret":"164551af334e1ec93e1b3099afd93a88"
		// }'

	    $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $url,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS => json_encode($params),
		  CURLOPT_HTTPHEADER => array(
		    'Content-Type: application/json'
		  ),
		));
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	private function getApiMethodPostAuthorization($url, $params){
		$this->contadorSolicitudes ++;
		if($this->typeProyect != "Production"){
			$client = new Client([
			    'verify' => 'C:/cacert.pem',
			]);
			$headers = [
			  'Content-Type' => 'application/json',
			  'Authorization' => 'Bearer '.$this->token
			];
			$body = json_encode($params);
			$request = new Request('POST', $url, $headers, $body);
			$res = $client->sendAsync($request)->wait();
			if ($res->getStatusCode() == 200) {
				return $res->getBody();
			} else {
			    return null;
			}
		}
		// '{
		//    "grant_type":"client_credentials",
		//    "client_id":"c79f7382012df0ea4c6fa37afec6374e",
		//    "client_secret":"164551af334e1ec93e1b3099afd93a88"
		// }'

	    $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $url,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS => json_encode($params),
		  CURLOPT_HTTPHEADER => array(
		    'Content-Type: application/json',
		    'Authorization: Bearer '.$this->getToken()
		  ),
		));
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	public function downloadPdf($id){
		$currentDate = date("Y/m/d");
	    $currentYear = date("Y");
	    $currentMonth = date("m");
	    $imagePath = './pdf/';
	    if (!file_exists($imagePath)) {
	        mkdir($imagePath);
	    }

	    if (!file_exists($imagePath . $currentYear)) {
	        mkdir($imagePath . $currentYear);
	    }
	    if (!file_exists($imagePath . $currentYear . '/' . $currentMonth)) {
	        mkdir($imagePath . $currentYear . '/' . $currentMonth);
	    }

	    $imageFilePath = $imagePath . $currentYear . '/' . $currentMonth . '/' . $id.'.pdf';
	    if (file_exists($imageFilePath)) {
	        // Establece el encabezado HTTP para forzar la descarga
		    header('Content-Type: application/pdf');
		    header('Content-Disposition: inline; filename="'.$id.'.pdf"'); // Cambia el nombre del archivo si es necesario
		    header('Content-Length: ' . filesize($imageFilePath));
		    // Lee el contenido del archivo y envíalo al navegador
		    readfile($imageFilePath);
		    exit();
	    }

	}

	public function getJson(){
		if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		$get = (object) $_GET;
    		$idUnico = $get->id ?? 0;
    		$this->downloadPdf($idUnico);

    		$json = $this->getApiMethodGet("https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/sendpulsev3/opinion/getjson.php?id=$idUnico");
    		$resp = json_decode($json, true);
    		if(!isset($resp["resp"])){
    			echo $this->pdf($resp, $idUnico);
    			exit();
    		}
    	}
		echo '{"resp":false}';
		exit();
    }

   	public function pdf($json, $id){
   		// $string = $this->ctrFunciones->getTemplatePHP($json, "https://pruebasecuavisa.phpdemo.site/sendpulse/opinion/template/opinion.php");
   		$string = $this->ctrFunciones->getTemplatePHP($json, "http://localhost/ecuavisa/ecuavisav2/servicios/pdfsendpulse/opinion/template/opinion.php");
   		$mpdf = new \Mpdf\Mpdf(
   			[
   				'default_font' => 'arial',
   				'format' => [130, 250]
   			]
   		);
   		$mpdf->WriteHTML($string);
   		$currentDate = date("Y/m/d");
	    $currentYear = date("Y");
	    $currentMonth = date("m");
	    $imagePath = './pdf/';
	    if (!file_exists($imagePath)) {
	        mkdir($imagePath);
	    }

	    if (!file_exists($imagePath . $currentYear)) {
	        mkdir($imagePath . $currentYear);
	    }
	    if (!file_exists($imagePath . $currentYear . '/' . $currentMonth)) {
	        mkdir($imagePath . $currentYear . '/' . $currentMonth);
	    }

	    $imageFilePath = $imagePath . $currentYear . '/' . $currentMonth . '/' . $id.'.pdf';

		$mpdf->Output($imageFilePath, "F");

		if (file_exists($imageFilePath)) {
	        // Establece el encabezado HTTP para forzar la descarga
		    header('Content-Type: application/pdf');
		    header('Content-Disposition: inline; filename="'.$id.'.pdf"'); // Cambia el nombre del archivo si es necesario
		    header('Content-Length: ' . filesize($imageFilePath));
		    // Lee el contenido del archivo y envíalo al navegador
		    readfile($imageFilePath);
		    exit();
	    }
   	// 	echo $string;
   	}
}