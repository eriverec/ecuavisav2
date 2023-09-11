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

	function __construct(){
		require '../funciones/Ctrfunciones.php';
		$this->ctrFunciones = new Ctrfunciones(array(
			"desfaseMinutosMax" => 15,
			"folder" => "opinion",
		));

		$getFecha = date("Y-m-d, H:i:s", time());

		$this->contadorSolicitudes = 0; //DESFASE DE MINUTOS
		$this->typeProyect =  "Guzzle"; //Production - Guzzle
		$this->dataJsonNewsletter = $this->getAttrNewsletter("64f9f5455c4a279b69ff2aca");
		$this->apiProtec = "https://www.ecuavisa.com/rss/boletin-opinion.json";

		// Crear un objeto DateTime con la fecha actual
		$fecha = new DateTime();
		// Establecer el idioma a español para los meses y días de la semana
		$meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
		$diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
		// Obtener el día de la semana, el día del mes, el mes y el año en español
		$diaSemana = $diasSemana[intval($fecha->format('w'))];
		$dia = $fecha->format('d');
		$mes = $meses[intval($fecha->format('m')) - 1];
		$anio = $fecha->format('Y');
		// Imprimir la fecha en español
		$this->fechaFormateada = "$diaSemana $dia de $mes de $anio";

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

	private function logToFile($functionName, $data) {
	    // Obtener la fecha y hora actual en el formato deseado
	    $fechaHoraActual = date('Y-m-d H:i:s');
	    // Obtener la información del cliente (dirección IP y agente de usuario)
	    $clienteInfo = $_SERVER['REMOTE_ADDR'] . ' - ' . $_SERVER['HTTP_USER_AGENT'];
	    // Obtener el resultado de print_r con la opción return y eliminar los saltos de línea
	    $dataAsString = str_replace(array("\r", "\n"), '', print_r($data, true));
	    // Construir el mensaje de registro
	    $logMessage = "[$fechaHoraActual] [$clienteInfo] [$functionName]: $dataAsString\n";
	    // Ruta del archivo de registro (puedes cambiarla según tus necesidades)
	    // $archivoLog = $this->archivoLog;
	    $archivoLog = 'opinion_log.txt';
	    // Guardar el mensaje de registro en el archivo
	    file_put_contents($archivoLog, $logMessage, FILE_APPEND);
	}

	private function getAttrNewsletter($id){
		$data = $this->getApiMethodGet('https://ads-service.vercel.app/newsletter/get/'.$id);
		if(!isset($data)){
			return null;
		}
		return json_decode($data);
	}

	private function UTMLinks($id, $link){
		$utm = [
			"utm_source=SendPulse&utm_medium=bannerHeader&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//0
			"utm_source=SendPulse&utm_medium=SeccionPolitica&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//1
			"utm_source=SendPulse&utm_medium=es&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//2
			"utm_source=SendPulse&utm_medium=noEs&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//3
			"utm_source=SendPulse&utm_medium=noEs&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//4
			"utm_source=SendPulse&utm_medium=Nota1&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//5
			"utm_source=SendPulse&utm_medium=Nota2&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//6
			"utm_source=SendPulse&utm_medium=Nota3&utm_campaign=N_CodigoRojas&utm_id=Newsletter"//7
		];

		//utm_source_ecuavisa=Prueba
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
		$this->logToFile("Consumo de token", array("accion" => "Init token"));
    	// Ruta al archivo JSON

    	$tokenSendPulse = [
    		"fecha" => date('Y-m-d H:i:s', time()),
    		"token" => null
    	];

    	$credenciales = [
			"grant_type" => "client_credentials",
			"client_id" => "c79f7382012df0ea4c6fa37afec6374e",
			"client_secret" => "164551af334e1ec93e1b3099afd93a88",
		];

    	if(isset($this->dataJsonNewsletter->data->tokenSendPulse->fecha)){
    		if($this->ctrFunciones->calcularTiempoTranscurridoEnMinutos($this->dataJsonNewsletter->data->tokenSendPulse->fecha) > 30){
    			//CREAS TOKEN
    			$tokenJson = $this->getApiMethodPost("https://api.sendpulse.com/oauth/access_token", $credenciales);

				$tokenSendPulse["token"] = json_decode($tokenJson)->access_token;
				
	    		$tokenJson = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
	    			"tokenSendPulse" => $tokenSendPulse
	    		]);
    		}else{
    			return $this->dataJsonNewsletter->data->tokenSendPulse->token;
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

    private function getNoticiaT($value){
    	// $value = $channel->item;
		$image = "";
		if(isset($value->content)){
			if(is_array($value->content)){
			  $image = $value->content[0]->url;
			}else{
			  $image = $value->content->url;
			}
		}
		//$image = $this->ctrFunciones->cropImagen($image);
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
		$descripcion_formateado = preg_replace('/<img[^>]+\>/i', '', $descripcion);
		$descripcion = substr($descripcion_formateado, 0, 290).'...';
		$descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
		$noticias[] = [
			"titulo" => $value->title,
			"link" => $value->link,
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
				    $secondArray = array_slice($noticias, 1);
				    $totalNoticia = count($noticias);

				    if($totalNoticia < 1){
				    	echo json_encode(["resp" => false, "mensaje" => "Error 012 - No hay datos que mostrar"]);
						exit();
				    }
				    
				    $i_1 = 1;
				    foreach ($firstArray as $key => &$v) {
				      $v["link"] = $this->UTMLinks($i_1, $v["link"]);
				      if($totalNoticia > 4){
				        $v["image"] = $this->ctrFunciones->cropImagen($v["image"], 440, 250);
				      }
				      $i_1 = $i_1 + 1;
				    }

				    $Notas_3 = 5;

				    foreach ($secondArray as $key => &$v) {
				      $v["link"] = $this->UTMLinks($Notas_3, $v["link"]);
				      $v["image"] = $this->ctrFunciones->cropImagen($v["image"], 250, 180, 80);
				      $i_1 = $i_1 + 1;

				      $Notas_3 = $Notas_3 + 1;
				    }

				    $finalArray = array($firstArray, $secondArray);
				    return $finalArray;
			    }
			}
		}

		echo json_encode(["resp" => false, "mensaje" => "Error 011 - No hay datos que mostrar"]);
		exit();
    }

    public function getToken(){
    	return $this->token;
    }

    private function getURLVerNavegador(){
		$link = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/navigatorview/email.php?lista='.$this->listaUsuario.'&titulo='.$this->nombreNeswletter.'&';
		return '<label style="display:none">'.$this->descripcion.'. Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy.</label><a title="Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy." target="blank_" style="text-decoration:none; color:#000" href="'.$link.'">Quiero ver en mi navegador</a>';
    }

    private function getOpinionesBloquesURL($list){
        $content = [];
        $titulosOpinionEs = [];
        $titulosOpinionNoEs = [];
		$titulosUrl = [];
		$bloquesN = [];
		$html = '';
		$existe = false;
		$existeNoEs = false;
		$existeEs = false;
		$coloresList = ["#00a1d3", "#2927b9"];

		if(is_array($list)){
            foreach ($list as $key => $value) {
            	if ($value->name === "esUnMejor") {
			        $titulosOpinionEs[] = $value->__text;
					$existe = true;
			    }
            }

            foreach ($list as $key => $value) {
            	if ($value->name === "noEsUnMejor") {
			        $titulosOpinionNoEs[] = $value->__text;
					$existe = true;
			    }
            }
        }

        if(count($titulosOpinionNoEs) < 1 && count($titulosOpinionEs) < 1){ // Si no existe ningun bloque no se pinta la sección
        	return "";
        }
        
        $ecuadirEsList = [];//Es un mejor
        $ecuadirNoEsList = [];//No es un mejor

        // print_r($ecuadirEsList);

        $ecuadorEs = '';

        if(count($titulosOpinionEs) > 0){
        	$ecuadirEsList = explode("*", $titulosOpinionEs[0]); //Es un mejor
        	$ecuadorEs.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; background-color:'.$coloresList[0].'; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#fff; margin:0; overflow:hiddenpadding-right: 15px;
		    padding-left: 0px;
		    padding-right: 0px;
		    padding-top: 0px;
		    padding-bottom: 0px;" border="0" width="100%">';
	    	$ecuadorEs.= '<tbody>';
	    	$ecuadorEs.= '<tr>';

	    	$ecuadorEs.= '<td>';
	    	$ecuadorEs.= '  <div style="display:block;text-align:center;background-color:'.$coloresList[0].';padding-left:20px;padding-right:20px;padding-bottom:15px;padding-top:20px">
			            		<p style="line-height:1.2; margin:0 0 10px; font-size:inherit; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-bottom:20px">
			            			<span style="font-size: 16px;">
			            				<strong>Ecuador hoy es un mejor país por...</strong>
			            			</span>
			            		</p>';
			for ($i=1; $i < count($ecuadirEsList); $i++) {
				$existeEs = true;
				$dataJsonList = explode("https://", $ecuadirEsList[$i]);

				if(count($dataJsonList) < 2){
					$ecuadorEs.= '';
				}else{
					$ecuadorEs.= '  <a href="'.$this->UTMLinks(2, 'https://'.$dataJsonList[1]).'" style="text-decoration: none;font-style: italic;line-height:1.2; margin:0 0 10px; font-size:14px; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;display:block;padding-bottom:10px">
			            			<span>'.$dataJsonList[0].'.</span>
			            		</a>';
				}

			}
		    $ecuadorEs.=   '</div>';
	    	$ecuadorEs.= '</td>';
	    	$ecuadorEs.= '</tr>';
	    	$ecuadorEs.= '</tbody>';
	    	$ecuadorEs.= '</table>';
        }
        

        $ecuadorNoEs = '';

        if(count($titulosOpinionNoEs) > 0){
        	$ecuadirNoEsList = explode("*", $titulosOpinionNoEs[0]);//No es un mejor
        	// echo json_encode($ecuadirNoEsList);
        	$ecuadorNoEs.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; background-color:'.$coloresList[1].'; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#fff; margin:0; overflow:hiddenpadding-right: 15px;
		    padding-left: 0px;
		    padding-right: 0px;
		    padding-top: 0px;
		    padding-bottom: 0px;" border="0" width="100%">';
	    	$ecuadorNoEs.= '<tbody>';
	    	$ecuadorNoEs.= '<tr>';
	    	$ecuadorNoEs.= '<td>';
	    	$ecuadorNoEs.= '  <div style="display:block;text-align:center;background-color:'.$coloresList[1].';padding-left:20px;padding-right:20px;padding-bottom:15px;padding-top:20px">
			            		<p style="line-height:1.2; margin:0 0 10px; font-size:inherit; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-bottom:20px">
			            			<span style="font-size: 16px;">
			            				<strong>Ecuador hoy no es un mejor país por...</strong>
			            			</span>
			            		</p>';

			for ($i=1; $i < count($ecuadirNoEsList); $i++) {
				$existeNoEs = true;
				$dataJsonList = explode("https://", $ecuadirNoEsList[$i]);
				if(count($dataJsonList) < 2){
					$ecuadorEs.= '';
				}
				else{
					$ecuadorNoEs.= '  <a href="'.$this->UTMLinks(3, 'https://'.$dataJsonList[1]).'" style="text-decoration: none;font-style: italic;line-height:1.2; margin:0 0 10px; font-size:14px; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;display:block;padding-bottom:10px">
			            			<span>'.$dataJsonList[0].'.</span>
			            		</a>';
				}
			}

		    $ecuadorNoEs.=   '</div>';
	    	$ecuadorNoEs.= '</td>';
	    	$ecuadorNoEs.= '</tr>';
	    	$ecuadorNoEs.= '</tbody>';
	    	$ecuadorNoEs.= '</table>';
        }
		
        return ($existeEs?$ecuadorEs:'').($existeNoEs?$ecuadorNoEs:'');
    }

    private function getImgParrafo($dataImg){
        if(!is_array($dataImg)){
            return "";
        }
        $convertList = $dataImg;
        $cutline = "";
        $byline = "";
        foreach ($convertList as $key => $value) {
            if($value->name == "Cutline"){
                $cutline = $value->__text;
            }
            if($value->name == "Byline"){
                $byline = "($value->__text)";
            }
        }
        
        if($cutline == ""){
            return "";
        }
        
        return '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%; font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
        	<tr>
        		<td>
        			<p style="
				        display:block;
						text-align: center;
						margin-top: 0px;
						padding: 10px;
						margin-bottom: 5px;
						font-style: italic;
					    color: #fff;
					    font-size: 12px;
					    background-color:#2e22b6;font-weight: 400;line-height: 1.2;" >'.$cutline.' '.$byline.'</p>
        		</td>
        	</tr>
        </table>';
    }

    private function getUltimaSeccion($data){
    	$html = '';
    	$html .= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;padding-top:20px;display:block" border="0" width="100%"><tbody><tr style="border-color:transparent"><td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%"><tbody><tr style="border-color:transparent"><th width="500" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc responsive " align="left" valign="top"><table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0"><tbody><tr style="border-color:transparent"><td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top"><table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_48" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; margin:0; overflow:hidden"><tbody><tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif"><td class="content-cell" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top"><p style="line-height:1; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="color: #000000;"><strong><span style="font-size: 18px;font-style: italic;">También te puede interesar...</span></strong></span></p><div style="font-size:14px; line-height:1.2; clear:both"></div></td></tr></tbody></table></td></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table>';
    	for ($i=0; $i < count($data) ; $i++) { 
    		$b = $data[$i];

    		$html .= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%">
			   <tbody>
			      <tr style="border-color:transparent">
			         <td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top">
			            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%">
			               <tbody>
			                  <tr style="border-color:transparent">
			                     <th width="250" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
			                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
			                           <tbody>
			                              <tr style="border-color:transparent">
			                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
			                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_22" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; margin:0; overflow:hidden">
			                                       <tbody>
			                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top">
			                                                <p canonicalurl="'.$b['link'].'" idart="5741040" style="line-height:1.2; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-top: 5px;"><span style="font-size: 20px; color: #000000;"><strong><span mlnid="idcon1084747order30"><a href="'.$b['link'].'" style="text-decoration:none; color:#000">
			                                                '.$b['titulo'].'</a></span></strong></span></p>
			                                                <div style="font-size:14px; line-height:1.2; clear:both"></div>
			                                             </td>
			                                          </tr>
			                                       </tbody>
			                                    </table>
			                                 </td>
			                              </tr>
			                           </tbody>
			                        </table>
			                     </th>
			                     <th width="250" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
			                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
			                           <tbody>
			                              <tr style="border-color:transparent">
			                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
			                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_27_element_0" style="border-collapse:separate; font-size:14px; line-height:1.2; overflow:hidden">
			                                       <tbody>
			                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:0px" valign="top">
			                                                <div id="wout_block_27_element_0" style="font-size:14px; line-height:1.2; width:100%; height:145; display:block; text-align:center" width="100%" height="145" align="center">
			                                                   <center>
			                                                   	<a href="'.$b['link'].'" style="text-decoration:none; color:#000">
			                                                      <img border="0" width="220" height="auto" class="desktop  sp-img small_img " align="center" alt="'.$b['titulo'].'" src="'.$b['image'].'" iout_block_27_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
			                                                      <div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img small_img " align="center" alt="'.$b['titulo'].'" src="'.$b['image'].'" iout_block_27_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:250px !important"></div>
			                                                      <!--<![endif]-->
			                                                    </a>
			                                                   </center>
			                                                </div>
			                                                <div style="font-size:14px; line-height:1.2; clear:both"></div>
			                                             </td>
			                                          </tr>
			                                       </tbody>
			                                    </table>
			                                 </td>
			                              </tr>
			                           </tbody>
			                        </table>
			                     </th>
			                  </tr>
			               </tbody>
			            </table>
			         </td>
			      </tr>
			   </tbody>
			</table>';
    	}

    	return $html;
    }

	public function getArticle($idarticle){
        $json = $this->getApiMethodGet("https://www.ecuavisa.com/news-portlet/getArticle/$idarticle.json");
        return json_decode($json);
    }

    private function getDetallesNotaPrincial($list, $getNota){
        $content = [];
        $titulo = "";
        $getFristNota = $getNota[0][0];
        $bloque3 = $getNota[1];

        // echo count($bloque3);
        $getOpinionesBloquesURLVar = $this->getOpinionesBloquesURL($list);
        if(is_array($list)){
            foreach ($list as $key => $value) {
                if($value->name == "Image"){
                    $content[] = '
                    <a style="text-decoration:none;color: black;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" href="'.$getFristNota["link"].'">
                    	<img width="200" style="width:100%;height:auto" src="'.$value->remoteContent->href.'" alt="Imagen de twitter">

				    </a>
                    ';
                }
                if($value->name == "Headline"){
                    $titulo = $value->__text;//'.$getFristNota["subseccion"]["link"].'

                    /*<a style="text-decoration:none;color: #311db3;font-weight: 700;font-size: 18px;" href="#">
				        				<p style="padding:0px;margin:0px">OPINIÓN</p>
				        			</a>*/

				        			/*<tr>
				        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;padding-top: 20px;padding-bottom: 0px;">
				        			<p style="text-decoration:none;color: #311db3;font-weight: 700;font-size: 18px;padding:0px;margin:0px">
				        				OPINIÓN
				        			</p>
				        		<td>
				        	<tr>*/
                    $content[] = '
                    	<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
                    		
				        	<tr>
				        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
				        			<a style="text-decoration:none;color: black;" href="'.$getFristNota["link"].'">
				        				<h1 style="margin-top: 0px;
				        					padding-bottom:5px;
				        					color:black;
										    font-size: 30px;
										    line-height: 1.2;
										    margin-bottom: 0px;
										 ">'.$value->__text.'</h1>
				        			</a>
				        		<td>
				        	<tr>
				        </table>';
                }
                if($value->name == "Subheadline"){
                    $content[] = '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
				        	<tr>
				        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
				        			<small>'.$value->__text.'</small>
				        		<td>
				        	<tr>
			        	</table>';
                }
                if($value->name == "Quotecv"){
                	$content[] = '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;line-height:1.2;width:100%;padding-left: 20px;padding-right: 20px;display: block;" border="0" width="100%">
					   <tbody>
					      <tr style="border-color:transparent">
					         <th width="55" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
					            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
					               <tbody>
					                  <tr style="border-color:transparent">
					                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
					                        <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_33_element_0" style="border-collapse:separate; font-size:14px; line-height:1.2; overflow:hidden">
					                           <tbody>
					                              <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
					                                 <td class="content-cell" width="25" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top">
					                                    <div id="wout_block_33_element_0" style="font-size:14px; line-height:1.2; width:100%; height:168.285714; display:block" width="100%" height="168.285714">
					                                       <img border="0" width="19" height="auto" class="desktop  sp-img small_img smallImg " align="right" alt="linea-vertical-opinion" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/linea-vertical-opinion.png" iout_block_33_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; margin:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
					                                       <div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img small_img smallImg " align="right" alt="linea-vertical-opinion" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/linea-vertical-opinion.png" iout_block_33_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:21px !important"></div>
					                                       <!--<![endif]-->
					                                    </div>
					                                    <div style="font-size:14px; line-height:1.2; clear:both"></div>
					                                 </td>
					                              </tr>
					                           </tbody>
					                        </table>
					                     </td>
					                  </tr>
					               </tbody>
					            </table>
					         </th>
					         <th width="445" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
					            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
					               <tbody>
					                  <tr style="border-color:transparent">
					                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
					                        <table class="separator" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.2; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; height:31px" height="31">
					                           <tbody>
					                              <tr style="border-color:transparent">
					                                 <td height="31" style="border-collapse:collapse; border-color:transparent"></td>
					                              </tr>
					                           </tbody>
					                        </table>
					                     </td>
					                  </tr>
					               </tbody>
					            </table>
					            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
					               <tbody>
					                  <tr style="border-color:transparent">
					                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
					                        <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_24" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#333; margin:0; overflow:hidden">
					                           <tbody>
					                              <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
					                                 <td class="content-cell padding-lr-0 padding-top-0 padding-bottom-0" width="430" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0; padding-right:15px; padding-top:0; padding-bottom:0" valign="top">
					                                    <p style="line-height:1.5; margin:0 0 10px; font-size:inherit; color:#333; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><strong><span style="font-size: 18px;">'.$value->__text.'</span></strong></p>
					                                    <div style="font-size:14px; line-height:1.2; clear:both"></div>
					                                 </td>
					                              </tr>
					                           </tbody>
					                        </table>
					                     </td>
					                  </tr>
					               </tbody>
					            </table>
					            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
					               <tbody>
					                  <tr style="border-color:transparent">
					                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
					                        <table class="separator" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.2; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; height:31px" height="31">
					                           <tbody>
					                              <tr style="border-color:transparent">
					                                 <td height="31" style="border-collapse:collapse; border-color:transparent"></td>
					                              </tr>
					                           </tbody>
					                        </table>
					                     </td>
					                  </tr>
					               </tbody>
					            </table>
					         </th>
					      </tr>
					   </tbody>
					</table>';
                    // $content[] = '
                    // <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			        // 	<tr>
			        // 		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
			        // 			<p style="display:block;
                    //             	text-align: center;
                    //             	font-weight: 700;
                    //             	margin-top: 0px;
                    //             	padding: 10px;
                    //             	margin-bottom: 5px;font-style: italic;
                    //                 color: #4a4663;
                    //                 font-size: 12px;background-color:#EDF0F3;line-height: 1.2;">'.$value->__text.'</p>
			        // 		<td>
			        // 	<tr>
			        // </table>
                    // ';
                }
                if($value->name == "Cita"){
                    $content[] = '
                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			        	<tr>
			        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
			        			<p style="display:block;
                                	text-align: left;
                                	font-weight: 700;
                                	margin-top: 0px;
                                	padding: 10px;
                                	margin-bottom: 5px;font-style: italic;
                                    color: #4a4663;
                                    font-size: 12px;line-height: 1.2;">'.$value->__text.'</p>
			        		<td>
			        	<tr>
			        </table>
                    ';
                }
                if($value->name == "SabiasQue"){
                    $content[] = '
                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			        	<tr>
			        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
                    			<div style="display:block;
                                	text-align: center;
                                	margin-top: 0px;
                                	padding: 25px 10px;
                                	margin-bottom: 5px;
                                    color: #fff;
                                    font-size: 12px;background-color:#2e22b6 "><b style="font-size: 17px;color:#23DCD1">¿SABÍAS QUE?</b><p style="font-style: italic;font-weight: 400;">'.$value->__text.'</p>
                                </div>
                            <td>
			        	<tr>
			        </table>
                    ';
                }
                if($value->name == "Text"){
                    $content[] = '
                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;font-weight: 400;" border="0" width="100%">
			        	<tr>
			        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
			        			<div>'.$value->__text.'</div>
			        		<td>
			        	<tr>
			        </table>';
                }
                if($value->name == "h2" || $value->name == "H2"){
                    $content[] = '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			        	<tr>
			        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">'."<h2 style='margin-bottom: 0px; padding-bottom: 0px;margin-top: 10px; padding-top: 10px;'>$value->__text</h2>".'
			        		<td>
			        	<tr>
			        </table>';
                }
                if($value->name == "bullet"){
                    $content[] = '
                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			        	<tr>
			        		<td style="padding-left: 20px;padding-right: 20px;padding-bottom:0px;padding-top:0px;font-weight: 400;">
			        			<ul>
								  <li>'.$value->__text.'</li>
								</ul>
			        		<td>
			        	<tr>
			        </table>';
                }
                if($value->name == "Image_Text"){
                //echo json_encode($value->component);
                    //$content[] = '<img width="100%" style="height: 300px;" class="img-principal" src="'.$value->remoteContent->href.'">';
                    $content[] = '<div style="margin-top: 10px;">
                    '.'<div style="background-image: url('.$value->remoteContent->href.'); background-repeat: no-repeat; background-size: cover; width: 100%; height: 320px;">
                    </div>'.(isset($value->component)?$this->getImgParrafo($value->component):"").'
                    </div>';
                }
                // if($value->name == "Youtube_Text"){
                //     $youtubeId = $value->__text;
                //     $youtubeThumbnail = 'https://img.youtube.com/vi/' . $youtubeId . '/maxresdefault.jpg';
                //     $youtubeUrl = 'https://www.youtube.com/watch?v=' . $youtubeId;
                    
                //     $content[] = '<a target="_blank" href="'.$youtubeUrl.'">
                //         <img width="70%" src="' . $youtubeThumbnail . '" alt="Video de YouTube">
                //     </a>';;
                // }
                // if($value->name == "Twitter_Text"){
                //     $url = $value->__text;
                //     $lastPart = "";
                //     if (filter_var($url, FILTER_VALIDATE_URL)) {
                //         $parsedUrl = parse_url($url);
                //         $path = $parsedUrl['path'];
                //         $parts = explode('/', $path);
                //         // $lastPart = end($parts);
                //         $lastPart = $url;
                //     } else {
                //         $lastPart = 'https://twitter.com/ecuavisa/status/'.$url;
                //     }
                //     $content[] = '<div  style="display:block;width: 100%;text-align: center">
                //     <a style="display:block;width: 100%;text-align: center" target="_blank" href="'.$lastPart.'">
                //         <img width="40%" src="https://ecuavisapdfs.phpdemo.site/uploads/imagen-twitter.png" alt="Video de YouTube">
                //     </a>
                //     </div>';
                // }
                if($value->name == "HTML_Text"){
                    $html = $value->__text;
                    if (preg_match('/<blockquote class="twitter-tweet">(.*?)<\/blockquote>/is', $html, $matches)) {
                        $blockquoteContent = $matches[1];
                    
                        // Encontrar el último enlace dentro del contenido del bloque
                        if (preg_match_all('/<a href="(.*?)"/i', $blockquoteContent, $linkMatches)) {
                            $lastHref = end($linkMatches[1]);
                            $content[] = '<div  style="display:block;width: 100%;text-align: center">
                            <a style="display:block;width: 100%;text-align: center" target="_blank" href="'.$lastHref.'">
                                <img width="35%" src="https://ecuavisapdfs.phpdemo.site/uploads/imagen-twitter.png" alt="Imagen de twitter">
                            </a>
                            </div>';
                        } else {
                            // echo "No se encontraron enlaces dentro del bloque 'twitter-tweet'.";
                        }
                    } else {
                        // echo "No se encontró el bloque 'twitter-tweet'.";
                        $pattern = '/<blockquote[^>]*class="([^"]*instagram-media[^"]*)"[^>]*data-instgrm-permalink="([^"]*)"[^>]*>/i';
                        preg_match($pattern, $html, $matches);
                        if (count($matches) >= 3) {
                          $class = $matches[1];  // Clase "instagram-media"
                          $permalink = $matches[2];  // Enlace "data-instgrm-permalink"
                        
                          // Imprimir los resultados
                        //   echo "Clase: $class\n";
                        //   echo "Enlace: $permalink\n";
                          $content[] = '<div  style="display:block;width: 100%;text-align: center">
                                <a style="display:block;width: 100%;text-align: center" target="_blank" href="'.$permalink.'">
                                    <img width="40%" src="https://ecuavisapdfs.phpdemo.site/uploads/instagram.png" alt="Imagen de instagram">
                                </a>
                                </div>';
                        } else {
                        //   echo "No se encontró ninguna coincidencia.\n";
                        }
                    }
                    
                }
            }

            $content[] = '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;padding-bottom:20px" border="0" width="100%"><tbody><tr style="border-color:transparent"><td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%"><tbody><tr style="border-color:transparent"><th width="500" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc responsive " align="left" valign="top"><table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0"><tbody><tr style="border-color:transparent"><td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top"><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.2; overflow:hidden"><tbody><tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif"><td class="content-cell padding-top-0" width="570" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:0; padding-bottom:25px" valign="top"><table cellpadding="0" border="0" cellspacing="0" align="left" class="sp-button flat auto-width" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-color:#ddd; border-width:1px; border-style:solid; border:0; width:auto !important; border-radius:5px; box-shadow:none; background:#141061" width="auto !important"><tbody><tr style="border-color:transparent"><td class="sp-button-text" style="border-collapse:collapse; border-color:transparent; padding:0; border-width:0; border-style:none; border:0; align:left; border-radius:5px; width:auto; height:40px; vertical-align:middle; text-align:center" width="auto" height="40" valign="middle" align="center"><table cellpadding="0" border="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px; line-height:1.2; border:0"><tbody><tr style="border-color:transparent"><td align="center" style="border-collapse:collapse; border-color:transparent; padding:0; border:0; line-height:1"><a style="text-decoration:none; color:#FFF; display:block; padding:12px 18px; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-size:16px; font-weight:bold" href="https://www.ecuavisa.com/noticias/?utm_source=SendPulse&utm_medium=SeccionPolitica&utm_campaign=N_CodigoRojas&utm_id=Newsletter">Ver otras noticias</a></td></tr></tbody></table></td></tr></tbody></table><div style="font-size:14px; line-height:1.2; clear:both"></div></td></tr></tbody></table></td></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table>';
            $content[] = $getOpinionesBloquesURLVar;
            $content[] = $this->getUltimaSeccion($bloque3);
        }

        // $id = $this->createJSONPHP(array(
		// 	"notaPrincipal" => $getFristNota,
		// 	"notasFinal" => $bloque3,
		// 	"fullPrinpial" => $list,

		// ))->id;

        return [$content, $titulo];
    }

    public function getNotaPrincipalHTML($idarticle, $getFristNota){
        $value = $this->getArticle($idarticle);
        $data = $this->getDetallesNotaPrincial($value->article->content->component, $getFristNota);
        return $data;
    }

    private function htmlTemplate(){
    	$getFecha = date("Y-m-d, H:i:s", time());
    	$nombreNeswletter = $this->nombreNeswletter;
		$idTemplate = $this->idTemplate;//148832;//TEMPLATE CORREO
		$list_id = $this->listaUsuario;//LISTA DE USUARIOS
		$notas = $this->getNotasNewTemplate();

		$template = json_decode($this->getApiMethodGetAuthorization("https://api.sendpulse.com/template/".$this->idTemplate));
		$htmlTemplate = $this->ctrFunciones->base64ToHTML($template->body);


		$lastSegment = (explode("/", $notas[0][0]["link"])); // Obtener el último segmento
		$textoSinParametros = explode("?", end($lastSegment));
		$ecSegment = explode("-", $textoSinParametros[0]);
		$numbersOnly = preg_replace("/[^0-9]/", "", end($ecSegment));// Obtener id de la nota capturada por la api de opinión


		$articulo = $this->getNotaPrincipalHTML($numbersOnly, $notas)[0];
		$bloque_noticias = "";
		for ($i=0; $i < count($articulo) ; $i++) { 
			$bloque_noticias .= $articulo[$i]; 
		}
		$bodyGenerar = str_replace("{{contenido}}", $bloque_noticias, $htmlTemplate);

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

		return [$bodyContent, $notas];
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
        	"body"=>$body
        ]);
        return json_decode($campaign);
    }

	public function view(){
		try {

			$getFecha = date("Y-m-d, H:i:s", time());
    		$template = $this->htmlTemplate();
			$bodyContent = $template[0];
			$notas = $template[1];
			$nombreNeswletter = $this->nombreNeswletter;
			$list_id = $this->listaUsuario;

			if(count($notas[0]) < 1){
				echo json_encode(["resp" => false, "mensaje" => "Hay un erro no hay notas en la api"]);
				exit();
			}

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
			echo '</div>';

			echo $bodyContent;
			exit();

		} catch (Exception $e) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo una excepción: " . $e->getMessage()]);
			exit();
		} catch (Error $error) {
		    echo json_encode(["resp" => false, "mensaje" => "Se produjo un error: " . $error->getMessage()]);
			exit();
		}
	}

	public function createNewsletter(){//
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
				// $resp = $this->armarCorreo($nombreNeswletter, $this->ctrFunciones->HtmlToBase64($bodyContent), $list_id);
        		
				$resp = json_decode('{
				  "id": 245587,
				  "status": 13, 
				  "count": 1, 
				  "tariff_email_qty": 1, 
				  "overdraft_price": "0.0044",
				  "ovedraft_currency": "RUR" 
				}');

				$respuestaJson = ["respSendPulse"=>$resp,"resp"=>isset($resp->id), "fecha"=>$getFecha];
        		
        		echo json_encode($respuestaJson);
        		
				if(isset($resp->id)){
					$this->logToFile("Crear campaña a SendPulse", array("accion" => "Crear campaña"));
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"enviado" => true
		    		]);
				}else{
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"error" => $respuestaJson
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

	public function forzado(){//
    	try {
    		$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
				"enviado" => true
			]);

    		$getFecha = date("Y-m-d, H:i:s", time());
    		$template = $this->htmlTemplate();
			$bodyContent = $template[0];
			$notas = $template[1];
			$nombreNeswletter = $this->nombreNeswletter;
			$list_id = $this->listaUsuario;

			if(count($notas[0]) > 0){
				// $resp = $this->armarCorreo($nombreNeswletter, $this->ctrFunciones->HtmlToBase64($bodyContent), $list_id);
        		
				$resp = json_decode('{
				  "id": 245587,
				  "status": 13, 
				  "count": 1, 
				  "tariff_email_qty": 1, 
				  "overdraft_price": "0.0044",
				  "ovedraft_currency": "RUR" 
				}');

				$respuestaJson = ["respSendPulse"=>$resp,"resp"=>isset($resp->id), "fecha"=>$getFecha];
        		
        		echo json_encode($respuestaJson);
        		
				if(isset($resp->id)){
					$this->logToFile("Crear campaña a SendPulse", array("accion" => "Crear campaña"));
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"enviado" => true
		    		]);
				}else{
					$updateNewsletter = $this->getApiMethodPost("https://ads-service.vercel.app/newsletter/update/".$this->dataJsonNewsletter->data->_id, [
		    			"error" => $respuestaJson
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