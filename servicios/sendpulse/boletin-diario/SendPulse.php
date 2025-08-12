<?php
require '../funciones/Ctrfunciones.php';
require '../vendor/autoload.php';
require __DIR__ . '/../logs/app/controllers/LogToFile.php';

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
	private $dominio;
	private $log;

	function __construct(){
		$this->log = new LogToFile();
		$this->typeProyect =  "Production"; //Production - Guzzle
		$this->dominio =  "https://services.ecuavisa.com/sendpulse";
		$this->ctrFunciones = new Ctrfunciones(array(
			"desfaseMinutosMax" => 5,
			"folder" => "boletin-diario",
			"folderPrimary" => ($this->typeProyect == "Production" ? "": "sendpulse"),
			"typeProyect" => $this->typeProyect
		));
		$this->jsonPDF = [];
		$getFecha = date("Y-m-d, H:i:s", time());

		$this->contadorSolicitudes = 0; //DESFASE DE MINUTOS
		$this->dataJsonNewsletter = $this->getAttrNewsletter("64f9f5225c4a279b69ff2ac8");
		$this->apiProtec = "https://www.ecuavisa.com/rss/boletin-diario.json";

		// Crear un objeto DateTime con la fecha actual
		$fecha = new DateTime();
		// Establecer el idioma a español para los meses y días de la semana
		$meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
		$diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		// Obtener el día de la semana, el día del mes, el mes y el año en español
		$diaSemana = $diasSemana[intval($fecha->format('w'))];
		$dia = $fecha->format('d');
		$mes = $meses[intval($fecha->format('m')) - 1];
		$anio = $fecha->format('Y');
		// Imprimir la fecha en español
		$this->fechaFormateada = "$diaSemana, $dia de $mes de $anio";

		if(!isset($this->dataJsonNewsletter)){
			echo json_encode(["resp" => false, "mensaje" => "Error 001 - No hay datos con el id proporsionado"]);
			exit();
		}

		if(!$this->dataJsonNewsletter->data->estado){
			echo json_encode(["resp" => false, "mensaje" => "Error 002 - Estado en 0"]);
			exit();
		}

		if(isset($this->dataJsonNewsletter->data->config)){
			$this->subject = str_replace("{{fecha}}", date("Y-m-d", time()), $this->dataJsonNewsletter->data->subject);
			$this->descripcion = $this->dataJsonNewsletter->data->descripcion;
			$this->sender_name = $this->dataJsonNewsletter->data->sender_name;
			$this->nombreNeswletter = $this->dataJsonNewsletter->data->nombre.' '.$getFecha;
			if(isset($this->dataJsonNewsletter->data->config->template)){
				$this->idTemplate = $this->dataJsonNewsletter->data->config->template;
			}else{
				$this->idTemplate = $this->dataJsonNewsletter->data->config->template->value;
			}
			if(isset($this->dataJsonNewsletter->data->config->template)){
				$this->listaUsuario = $this->dataJsonNewsletter->data->config->addressbook;
			}else{
				$this->listaUsuario = $this->dataJsonNewsletter->data->config->addressbook->value;
			}
			
			$this->token = $this->initToken();
			if(!isset($this->token)){
				echo json_encode(["resp" => false, "mensaje" => "Error 005 - Acceso no permitido, no se pudo crear token"]);
				exit();
			}
			$this->sender_email = $this->dataJsonNewsletter->data->sender_email;
		}else{
			echo json_encode(["resp" => false, "mensaje" => "Error 006 - No hay config"]);
			exit();
		}
    }

    private function getAttrNewsletter($id){
		$data = $this->getApiMethodGet('https://ads-service.vercel.app/newsletter/get/'.$id);
		if(!isset($data)){
			return null;
		}
		return json_decode($data);
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

	private function initToken(){
		date_default_timezone_set('America/Guayaquil');
		// $this->logToFile("Consumo de token", array("accion" => "Init token"));
    	// Ruta al archivo JSON

    	$tokenSendPulse = [
    		"fecha" => date('Y-m-d H:i:s', time()),
    		"token" => ""
    	];

    	$credenciales = [
			"grant_type" => "client_credentials",
			"client_id" => "c79f7382012df0ea4c6fa37afec6374e",
			"client_secret" => "164551af334e1ec93e1b3099afd93a88",
		];

    	if(isset($this->dataJsonNewsletter->data->tokenSendPulse->fecha)){
    		if(
    			$this->ctrFunciones->calcularTiempoTranscurridoEnMinutos($this->dataJsonNewsletter->data->tokenSendPulse->fecha) > 30
    			|| !isset($this->dataJsonNewsletter->data->tokenSendPulse->token)
    		){
    			//CREAS TOKEN
    			$tokenJson = $this->getApiMethodPost("https://api.sendpulse.com/oauth/access_token", $credenciales);

				$tokenSendPulse["token"] = json_decode($tokenJson)->access_token;
				
	    		$tokenJson = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
	    			"tokenSendPulse" => $tokenSendPulse
	    		]);
    		}else{
    			if($this->dataJsonNewsletter->data->tokenSendPulse->token == null || $this->dataJsonNewsletter->data->tokenSendPulse->token == ""){
    				//CREAS TOKEN
	    			$tokenJson = $this->getApiMethodPost("https://api.sendpulse.com/oauth/access_token", $credenciales);

					$tokenSendPulse["token"] = json_decode($tokenJson)->access_token;
					
		    		$tokenJson = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"tokenSendPulse" => $tokenSendPulse
		    		]);

		    		return $tokenSendPulse["token"];
    			}else{
    				return $this->dataJsonNewsletter->data->tokenSendPulse->token;
    			}
    			
    		}
    	}else{
    		//CREAS TOKEN
    		$tokenJson = $this->getApiMethodPost("https://api.sendpulse.com/oauth/access_token", $credenciales);

			$tokenSendPulse["token"] = json_decode($tokenJson)->access_token;

    		$tokenJson = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
    			"tokenSendPulse" => $tokenSendPulse
    		]);
    	}

    	return $tokenSendPulse["token"];
    }

    public function getToken(){
    	return $this->token;
    }

    private function logToFile($data = array()) {
	    // Obtener la fecha y hora actual en el formato deseado
	    $fechaHoraActual = date('Y-m-d H:i:s');
	    // // Obtener la información del cliente (dirección IP y agente de usuario)
	    $ip = $_SERVER['REMOTE_ADDR'];
	    $agente = $_SERVER['HTTP_USER_AGENT'];

	    // // Obtener el resultado de print_r con la opción return y eliminar los saltos de línea
	    // $dataAsString = str_replace(array("\r", "\n"), '', print_r($data, true));
	    // // Construir el mensaje de registro
	    // $logMessage = "[$fechaHoraActual] [$clienteInfo] [$functionName]: $dataAsString\n";
	    // // Ruta del archivo de registro (puedes cambiarla según tus necesidades)
	    // // $archivoLog = $this->archivoLog;
	    // $archivoLog = 'boletin_log.txt';
	    // // Guardar el mensaje de registro en el archivo
	    // file_put_contents($archivoLog, $logMessage, FILE_APPEND);

		return $this->log->add([
			"ip"=>$ip,
			"user_agent"=> $agente,
			"action"=> $data["action"] ?? "",
			"datetime"=> $fechaHoraActual,
			"file"=> "boletin-diario.json",
			"campaign"=>"Boletín Diario 7AM",
			"campaign_title"=> $data["campaign_title"] ?? "",
			"description"=> $data["description"] ?? "",
			"send_method" => $data["send_method"] ?? "",
			"type" => $data["type"] ?? "",
			"subject" => $this->subject ?? "",
			"resp" => $data["resp"] ?? [],
			"notas" => $data["notas"] ?? []
		]);
	}

	private function UTMLinks($id, $link){
		$utm = [
				"utm_source=SendPulse&utm_medium=bannerHeader&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Nota1&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Nota2&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Nota3&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Nota4&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Nota5&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Adicional1&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Adicional2&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=Adicional3&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter",
				"utm_source=SendPulse&utm_medium=CancelarSuscripcion&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter"
			];

		if(count($utm) < $id + 1){
			return $link;
		}
		
		// Obtener la URL actual
	    $urlActual = $link;

	    // Verificar si la URL ya tiene parámetros
	    if (strpos($urlActual, '?') !== false) {
	        // Si ya tiene parámetros, agregamos los UTM con un '&'
	        $urlActual .= '&' . $utm[$id];
	    } else {
	        // Si no tiene parámetros, agregamos los UTM con un '?'
	        $urlActual .= '?' . $utm[$id];
	    }
	    return $urlActual;
	}

	private function formatearDescripcion($texto, $longitudMaxima = 290) {
		// Verificar si la descripción está vacía o no válida
		if (empty($texto) || !is_string($texto)) {
			return ''; // Retorna una cadena vacía en caso de que no haya texto válido
		}
		// Eliminar etiquetas <img>
		$textoFormateado = preg_replace('/<img[^>]+\>/i', '', $texto);
	
		// Truncar texto asegurando que no corte palabras ni etiquetas
		if (strlen(strip_tags($textoFormateado)) > $longitudMaxima) {
			$textoCortado = substr($textoFormateado, 0, $longitudMaxima);
			
			// Asegurar que no corte palabras
			$ultimaEspacio = strrpos($textoCortado, ' ');
			$textoCortado = substr($textoCortado, 0, $ultimaEspacio) . '...';
	
			// Cerrar etiquetas abiertas
			$textoFormateado = $this->closeHtmlTags($textoCortado);
		}
	
		// Reemplazar estilo en etiquetas <a>
		$textoFinal = str_replace('<a ', '<a style="color: #444;" ', $textoFormateado);
	
		return $textoFinal;
	}


	private function closeHtmlTags($html) {
		// Encontrar todas las etiquetas abiertas y cerradas
		preg_match_all('/<([a-z]+)(?: .*)?(?<!\/)>/iU', $html, $tagsAbiertos);
		preg_match_all('/<\/([a-z]+)>/iU', $html, $tagsCerrados);
	
		// Comparar etiquetas abiertas con cerradas
		$tagsAbiertos = $tagsAbiertos[1];
		$tagsCerrados = $tagsCerrados[1];
	
		// Identificar etiquetas no cerradas
		$tagsSinCerrar = array_diff($tagsAbiertos, $tagsCerrados);
	
		// Cerrar etiquetas no cerradas en orden inverso
		foreach (array_reverse($tagsSinCerrar) as $tag) {
			$html .= "</$tag>";
		}
	
		return $html;
	}

	private function getNoticiaT($value){
    	// $value = $channel->item;
		$image = "https://estadisticas.ecuavisa.com/sites/gestor/Recursos/imagen-fondo-defecto.png";

		if(isset($value->content)){
			if(is_array($value->content)){
			  $image = $value->content[0]->url;
			}else{
			  $image = $value->content->url;
			}
		}

		//$image = $this->cropImagen($image);
		$tituloSubseccion = (count(explode("/", $value->link)) > 5 ? explode("/", $value->link)[4]:explode("/", $value->link)[3]);
		$linkSubseccion = explode($tituloSubseccion, $value->link)[0].$tituloSubseccion;

		// Obtener los componentes de la URL
		$componentes = parse_url($linkSubseccion);
		// Obtener el path
		$path = $componentes['path'];
		// Dividir el path en partes usando el separador '/'
		$partesPath = explode('/', trim($path, '/'));
		// Obtener la primera parte del path
		$primeraParte = $partesPath[0];
		$tituloSubseccion = $primeraParte;

		$descripcion = $value->description->__text;
		// $descripcion_formateado = preg_replace('/<img[^>]+\>/i', '', $descripcion);
		// $descripcion = substr($descripcion_formateado, 0, 290).'...';
		// $descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
		$descripcionFinal = $this->formatearDescripcion($descripcion);
		$noticias[] = [
			"titulo" => $value->title,
			"link" => $value->link,
			"color" => $this->imgSeparador($linkSubseccion),
			"descripcion" => $descripcionFinal,
			"subseccion" => [
				"titulo" => str_replace('-', ' ', strtoupper($tituloSubseccion)),
				"link" => $linkSubseccion
			],
			"image" => $image
		];
		return $noticias;
    }

	private function getNotasNewTemplate(){
		$dataNotas = json_decode($this->getApiMethodGet($this->apiProtec));
		if(!isset($dataNotas)){
			echo json_encode(["resp" => false, "mensaje" => "Error 010 - No hay datos que mostrar"]);
			exit();
		}
		if(isset($dataNotas->rss)){
			$rssNotas = $dataNotas->rss;
			if(isset($dataNotas->rss)){
				$channel = $rssNotas->channel;
				$noticias = [];
				if(isset($channel->item)){
					if(is_array($channel->item)){
						foreach ($channel->item as $key => $value) {
							$noticias[] = $this->getNoticiaT($value)[0];
						}
					}else{
						$noticias[] = $this->getNoticiaT($channel->item)[0];
					}

			      	$firstArray = array_slice($noticias, 0, 1);
					$secondArray = array_slice($noticias, 1, 2);
					$thirdArray = array_slice($noticias, 3);
					$totalNoticia = count($noticias);
					
					$i_1 = 0;
					foreach ($firstArray as $key => &$v) {
						$v["link"] = $this->UTMLinks($i_1, $v["link"]);
						// if($totalNoticia > 4){
							
						// }
						$v["image"] = $this->ctrFunciones->cropImagen($v["image"], 440, 250);
						$i_1 = $i_1 + 1;
					}

					foreach ($secondArray as $key => &$v) {
						$v["link"] = $this->UTMLinks($i_1, $v["link"]);
						// if($totalNoticia > 4){
							
						// }
						$v["image"] = $this->ctrFunciones->cropImagen($v["image"], 250, 225, 80);
						
						$i_1 = $i_1 + 1;
					}
					
					foreach ($thirdArray as $key => &$v) {
						$v["link"] = $this->UTMLinks($i_1, $v["link"]);
						// if($totalNoticia > 4){
							
						// }
						$v["image"] = $this->ctrFunciones->cropImagen($v["image"], 250, 175);
						$i_1 = $i_1 + 1;
					}
					

					$finalArray = array($firstArray, $secondArray, $thirdArray);
					return $finalArray;
			    }
			}
		}

		echo json_encode(["resp" => false, "mensaje" => "Error 011 - No hay datos que mostrar"]);
		exit();
    }

    private function getTemplatePHP($data, $url){
    	$datos = $data;
		$options = array(
		    'http' => array(
		        'method' => 'POST',
		        'header' => 'Content-type: application/x-www-form-urlencoded',
		        'content' => http_build_query($datos)
		    )
		);
		$context = stream_context_create($options);
		$content = file_get_contents($url, false, $context);
		return $content;
    }

    private function getURLVerNavegador(){
		$link = $this->dominio.'/navigatorview/email.php?lista='.$this->listaUsuario.'&titulo='.$this->nombreNeswletter.'';
		return '<label style="display:none">'.$this->descripcion.'. Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy.</label><a title="Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy." target="blank_" style="text-decoration:none; color:#000" href="'.$link.'">Quiero ver en mi navegador</a>';
    }

    private function imgSeparador($link_category){
    	/*VERDE: 0*/
    	/*OTRO: 1*/
    	$imagenes = ["https://estadisticas.ecuavisa.com/sites/gestor/Tools%2Fsendpulse%2FVector%2016.png", "https://estadisticas.ecuavisa.com/sites/gestor/Tools%2Fsendpulse%2FVector%2017.png", "https://estadisticas.ecuavisa.com/sites/gestor/Newsletter%2Fcintillo_azull_nl.png"];
    	

    	$frase = strtolower($link_category);
		$palabra = strtolower("deportes");
    	if(strpos(strtolower($frase), $palabra) !== false){
			return array("#2bb76b", $imagenes[0]);
		}

		$palabra = strtolower("entretenimiento");
    	if(strpos(strtolower($frase), $palabra) !== false){
    		return array("#ff006b", $imagenes[1]);
		}

		return array("#2927B9", $imagenes[2]);
    }

	private function htmlTemplate(){
    	$getFecha = date("Y-m-d, H:i:s", time());
    	$nombreNeswletter = $this->nombreNeswletter;
		$idTemplate = $this->idTemplate;//148832;//TEMPLATE CORREO
		$list_id = $this->listaUsuario;//LISTA DE USUARIOS
		$notas = $this->getNotasNewTemplate();

		$template = json_decode($this->getApiMethodGetAuthorization("https://api.sendpulse.com/template/".$this->idTemplate));
		$htmlTemplate = $this->ctrFunciones->base64ToHTML($template->body);

		$bloque_noticias = "";
		foreach ($notas[0] as $key => $nota) { 
			$bloque_noticias .= $this->getTemplatePHP($nota, $this->dominio."/template/boletin-diario/portada.php"); 
		}
		$bodyGenerar = str_replace("{{ bloque_noticias }}", $bloque_noticias, $htmlTemplate);


		$bloque_2_verticales = "";
		// foreach ($notas[1] as $key => $nota) { 
		$bloque_2_verticales .= $this->getTemplatePHP($notas[1], $this->dominio."/template/boletin-diario/2-notas.php"); 
		// }
		$bodyGenerar = str_replace("{{ bloque_2_verticales }}", $bloque_2_verticales, $bodyGenerar);


		$bloque_2_horizontales = "";
		// foreach ($notas[1] as $key => $nota) { 
		$bloque_2_horizontales .= $this->getTemplatePHP($notas[2], $this->dominio."/template/boletin-diario/2-notas-abajo.php"); 
		// }
		$bodyGenerar = str_replace("{{ bloque_2_horizontales }}", $bloque_2_horizontales, $bodyGenerar);
		

		$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
		$bodyGenerar = str_replace("{{date}}", $this->fechaFormateada , $bodyGenerar);
		$bodyGenerar = str_replace("{{linkNavegador}}", $this->getURLVerNavegador() , $bodyGenerar);
		$bodyGenerar = str_replace("{{_nlid}}", $list_id."&name=".$nombreNeswletter."&utm_source=SendPulse&utm_medium=CancelarSuscripcion&utm_campaign=N_EcuavisaInforma&utm_id=Newsletter" , $bodyGenerar);
		$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
		$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
		/*$name, $body, $list_id*/
		$bodyContent = "";
        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
		    $bodyContent = $matches[1];
		}

		return [ $this->ctrFunciones->minificar_html($bodyContent) , $notas ];
    }

    private function armarCorreo($name, $body, $list_id){
    	$getFecha = date("Y-m-d, H:i:s", time());
        $sender_name = $this->sender_name;
        $sender_email = $this->sender_email;
        $subject = $this->subject;
        $name = $name;
        $campaign = $this->getApiMethodPostAuthorization('https://api.sendpulse.com/campaigns', [
        	"sender_name"=>$sender_name,
        	"sender_email"=>$sender_email,
        	"subject"=>$subject,
        	"list_id"=>$list_id,
        	"name"=>$name,
        	"body"=> $body
        ]);
        return json_decode($campaign);
    }

    public function createNewsletter(){
		try {

			if($this->ctrFunciones->haPasadoDesfase($this->dataJsonNewsletter->data->config)){
				if($this->dataJsonNewsletter->data->enviado){
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"enviado" => false
		    		]);
				}
				echo json_encode(["resp" => false, "mensaje" => "La hora es superior, venga mañana antes."]);
				exit();
			}
			
			if(!$this->ctrFunciones->validarAcceso($this->dataJsonNewsletter->data->config)){
				if($this->dataJsonNewsletter->data->enviado){
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"enviado" => false
		    		]);
				}
				echo json_encode(["resp" => false, "mensaje" => "Error 004 - Acceso no permitido de acuerdo a la fecha indicada"]);
				exit();
			}

    		if($this->dataJsonNewsletter->data->enviado){
				echo json_encode(["resp" => false, "mensaje" => "Error 003 - Newsletter ya fue enviado anteriormente"]);
				exit();
			}


    		$getFecha = date("Y-m-d, H:i:s", time());
    		$template = $this->htmlTemplate();
			$bodyContent = $template[0];
			$notas = $template[1];
			$nombreNeswletter = $this->nombreNeswletter;
			$list_id = $this->listaUsuario;

			if(count($notas[0]) > 0){
				$resp = [];
				if($this->typeProyect == "Production"){
					$resp = $this->armarCorreo($nombreNeswletter, $this->ctrFunciones->HtmlToBase64($bodyContent), $list_id);
				}else{
					$resp = json_decode('{
					  "id": 245587,
					  "status": 13, 
					  "count": 1, 
					  "tariff_email_qty": 1, 
					  "overdraft_price": "0.0044",
					  "ovedraft_currency": "RUR" 
					}');
				}

				$respuestaJson = ["respSendPulse"=>$resp,"resp"=>isset($resp->id), "fecha"=>$getFecha];
        		
        		echo json_encode($respuestaJson);
        		
				if(isset($resp->id)){
					// $this->logToFile("Crear campaña a SendPulse", array("accion" => "Crear campaña"));
					$this->logToFile([
						"action"=> "create_campaign",
						"campaign_title"=> $this->nombreNeswletter,
						"description"=> "Campaña creada correctamente",
						"send_method" => "automático",
						"type" => "success",
						"resp" => $respuestaJson,
						"notas" => $notas
					]);

					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"enviado" => true
		    		]);

				}else{
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"error" => $respuestaJson
		    		]);
					
					$this->logToFile([
						"action"=> "create_campaign",
						"campaign_title"=> $this->nombreNeswletter,
						"description"=> "Error al crear campaña",
						"send_method" => "automático",
						"type" => "error",
						"resp" => $respuestaJson,
						"notas" => $notas
					]);

				}
				// echo json_encode(["resp"=>true, "message"=>"Newsletter creado."]);
	        	exit();
			}

			echo json_encode(["resp" => false, "message"=>"El Newsletter no fue enviado por que no existe notas que enviar"]);
	        exit();

		} catch (Exception $e) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo una excepción: " . $e->getMessage()]);
			exit();
		} catch (Error $error) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo un error: " . $error->getMessage()]);
			exit();
		}
	}

    public function view(){
		try {
			$getFecha = date("Y-m-d, H:i:s", time());
    		$template = $this->htmlTemplate();
			$bodyContent = $template[0];
			$notas = $template[1];

			if(count($notas[0]) < 1){
				echo json_encode(["resp" => false, "mensaje" => "Hay un erro no hay notas en la api"]);
				exit();
			}

			$nombreNeswletter = $this->nombreNeswletter;
			$list_id = $this->listaUsuario;

			// Obtener longitud del texto en bytes
			$tamanoBytes = strlen($bodyContent);

			// Convertir a kilobytes
			$tamanoKB = round($tamanoBytes / 1024, 2);

    		echo '<div style="max-width: 500px;margin-left: auto;margin-right: auto;padding:30px">';
			echo '<b>Subject: </b>'.$this->subject;
			echo '<br>';
			echo '<b>Descripción: </b>'.$this->descripcion;
			echo '<br>';
			echo '<b>ID Lista de usuario: </b>'.$this->listaUsuario;
			echo '<br>';
			echo '<b>Sender email: </b>'.$this->sender_email;
			echo '<br>';
			echo '<b>Nombre de la plantilla: </b>'.$this->nombreNeswletter;
			echo '<br>';
			echo '<b>Número de solicitudes HTTP: </b>'.$this->contadorSolicitudes;
			echo '<br>';
			if($tamanoKB > 95 && $tamanoKB < 100){
				echo '<b>Tamaño del boletín según su contenido: </b>'.$tamanoKB.'Kb, <b style="color:red">estás a punto de exceder el tamaño recomendado de 100Kb</b>';
			}else{
				if($tamanoKB > 99){
					echo '<b>Tamaño del boletín según su contenido: </b>'.$tamanoKB.'Kb, <b style="color:red">el tamaño recomendado es de 100Kb</b>';
				}else{
					echo '<b>Tamaño del boletín según su contenido: </b>'.$tamanoKB.'Kb';
				}
			}
			echo '</div>';

			echo $bodyContent;
			echo '<br>';
			echo '<div style="max-width: 500px;margin-left: auto;margin-right: auto;padding:20px;word-break: break-all;display:none">'.$this->ctrFunciones->HtmlToBase64($bodyContent).'</div>';
			$this->logToFile([
				"action"=> "view_campaign",
				"campaign_title"=> "",
				"description"=> "Vista del boletín diario",
				"send_method" => "manual",
				"type" => "success",
				"resp" => []
			]);

			// $this->logToFile([
			// 	"action"=> "create_campaign",
			// 	"campaign_title"=> "Ecuavisa Informa 7AM 2025-08-12, 11:26:34",
			// 	"description"=> "Error al crear campaña",
			// 	"send_method" => "manual",
			// 	"type" => "error",
			// 	"resp" => [
			// 		"respSendPulse"=>[
			// 			"message"=>"You have exceeded your monthly limit", 
			// 			"error_code"=>708
			// 		],
			// 		"resp"=>false,
			// 		"fecha"=>"2025-08-12 11:24:21"
			// 	]
			// ]);
			exit();

		} catch (Exception $e) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo una excepción: " . $e->getMessage()]);
			exit();
		} catch (Error $error) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo un error: " . $error->getMessage()]);
			exit();
		}
	}

	public function forzado(){
    	try {

    		$getFecha = date("Y-m-d, H:i:s", time());
    		$template = $this->htmlTemplate();
			$bodyContent = $template[0];
			$notas = $template[1];
			$nombreNeswletter = $this->nombreNeswletter;
			$list_id = $this->listaUsuario;

			if(count($notas[0]) > 0){
				$resp = [];
				if($this->typeProyect == "Production"){
					$resp = $this->armarCorreo($nombreNeswletter, $this->ctrFunciones->HtmlToBase64($bodyContent), $list_id);
				}else{
					$resp = json_decode('{
					  "id": 245587,
					  "status": 13, 
					  "count": 1, 
					  "tariff_email_qty": 1, 
					  "overdraft_price": "0.0044",
					  "ovedraft_currency": "RUR" 
					}');
				}

				$respuestaJson = ["respSendPulse"=>$resp,"resp"=>isset($resp->id), "fecha"=>$getFecha];
        		
        		echo json_encode($respuestaJson);
        		
				if(isset($resp->id)){
					// $this->logToFile("Crear campaña a SendPulse", array("accion" => "Crear campaña"));
					// $updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    		// 	"enviado" => true
		    		// ]);
					$this->logToFile([
						"action"=> "create_campaign",
						"campaign_title"=> $this->nombreNeswletter,
						"description"=> "Campaña creada correctamente",
						"send_method" => "manual",
						"type" => "success",
						"resp" => $respuestaJson,
						"notas" => $notas
					]);
				}else{
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"error" => $respuestaJson
		    		]);
					

					$this->logToFile([
						"action"=> "create_campaign",
						"campaign_title"=> $this->nombreNeswletter,
						"description"=> "Error al crear campaña",
						"send_method" => "manual",
						"type" => "error",
						"resp" => $respuestaJson,
						"notas" => $notas
					]);
				}
				// echo json_encode(["resp"=>true, "message"=>"Newsletter creado."]);
	        	exit();
			}

			echo json_encode(["resp" => false, "message"=>"El Newsletter no fue enviado por que no existe notas que enviar"]);
	        exit();

    	} catch (Exception $e) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo una excepción: " . $e->getMessage()]);
			exit();
		} catch (Error $error) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo un error: " . $error->getMessage()]);
			exit();
		}
    }
}