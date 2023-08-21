<?php
class SendPulse {

	private $token;
	private $sender_email;
	private $fecha;
	private $fechaDeEnvio;
	private $listaUsuario;
	private $nombreNeswletter;
	private $idTemplate;
	private $subject;
	private $descripcion;
	private $horai;
	private $horaf;

	function __construct(){
		/*"Gracias por formar parte de la familia de Ecuavisa.com";*/
		$obtenerJsonSubject = $this->getAttrBoletin(1);
		$getFecha = date("Y-m-d, H:i:s", time());
		$this->fechaDeEnvio = $this->obtenerFechaHoraFormateada("14:30:00");//send_date
		$this->descripcion = $obtenerJsonSubject->descripcion;
		$this->subject = str_replace("{{fecha}}", date("Y-m-d", time()), $obtenerJsonSubject->subject);//"🛑 Este es el legado de Agustín Intriago, el alcalde de Manta asesinado en un ataque armado";//"Ecuavisa Informa - ".$getFecha;
		$this->nombreNeswletter = "Ecuavisa Informa ".$getFecha;

		// echo $this->nombreNeswletter;
        // $this->listaUsuario = 574818;
        // $this->idTemplate = 148832;
        $this->horai = '06:00:00';
        $this->horaf = '23:00:00';
        $this->listaUsuario = 574818;//565083;
        $this->idTemplate = 148832;// ID Gracias:160050;
        $this->token = $this->initToken();
        $this->sender_email = "ecuavisainforma@ecuavisa.com";

        // // Obtener el número del mes
		// $numeroMes = date("n");
		// // Obtener el nombre del mes en español
		// $nombreMes = $this->obtenerMesEnEspanol($numeroMes);
		// $fechaFormateada =  $nombreMes. " ". date("d") . ", " . date("Y");

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

		// echo str_replace("{{fecha}}", date("Y-m-d", time()), $this->getAttrBoletin(1)->subject);
		$this->fechaFormateada = "$diaSemana, $dia de $mes de $anio";
    }

    private function obtenerFechaHoraFormateada($hora) {
	    $fechaHoraActual = time(); // Obtener la fecha y hora actual en formato Unix (timestamp)
	    $horaActual = date('H:i:s', $fechaHoraActual); // Obtener la hora actual en formato H:i:s

	    // Obtener la hora deseada (07:00:00 en este caso) y combinarla con la fecha actual
	    $fechaHoraDeseada = date('Y-m-d') . ' '.$hora;

	    // Comparar la hora actual con la hora deseada
	    if ($horaActual >= $hora) {
	        // Si la hora actual es mayor o igual a las 07:00:00, incrementamos la fecha en 1 día
	        $fechaHoraDeseada = date('Y-m-d', strtotime('+1 day')) . ' '.$hora;
	    }

	    return $fechaHoraDeseada;
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

	private function getAttrBoletin($id){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/json/boletin-diario/forzado/ajax.php?id='.$id,
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
		return json_decode($response);
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
	    $archivoLog = 'boletin_log.txt';
	    
	    // Guardar el mensaje de registro en el archivo
	    file_put_contents($archivoLog, $logMessage, FILE_APPEND);
	}

	public function initToken(){
		date_default_timezone_set('America/Guayaquil');
		$this->logToFile("Consumo de token", array("accion" => "Init token"));
    	// Ruta al archivo JSON
		$rutaArchivo = './../token.json';
		// Leer el contenido del archivo JSON
		$contenidoJSON = file_get_contents($rutaArchivo);
		// Decodificar el contenido JSON en un array asociativo
		$datos = json_decode($contenidoJSON, true);
		if($this->calcularTiempoTranscurridoEnMinutos($datos["fecha"]) > 30){
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

			$newFile = array(
				"fecha" => date('Y-m-d H:i:s', time()),
				"token" => json_decode($response)->access_token
			);
			file_put_contents($rutaArchivo, json_encode($newFile));

			return json_decode($response)->access_token;
		}

		return $datos["token"];
        
    }

    public function getToken(){
    	return $this->token;
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

    public function getListUser($id=564325){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.sendpulse.com/addressbooks/'.$id.'/emails',
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

    private function getURLVerNavegador(){
		//return '<a style="text-decoration:none; color:#000" href="#">Quiero ver en mi navegador</a>';
        // $curl = curl_init();
		// curl_setopt_array($curl, array(
		//   CURLOPT_URL => 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/navigatorview/api.php?lista='.$this->listaUsuario.'&titulo='.$this->nombreNeswletter,
		//   CURLOPT_RETURNTRANSFER => true,
		//   CURLOPT_ENCODING => '',
		//   CURLOPT_MAXREDIRS => 10,
		//   CURLOPT_TIMEOUT => 0,
		//   CURLOPT_FOLLOWLOCATION => true,
		//   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		//   CURLOPT_CUSTOMREQUEST => 'GET',
		// ));

		// $response = curl_exec($curl);

		// curl_close($curl);
		$link = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/navigatorview/email.php?lista='.$this->listaUsuario.'&titulo='.$this->nombreNeswletter.'';

		return '<label style="display:none">'.$this->descripcion.'. Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy.</label><a title="Ecuavisa | Últimas Noticias del Ecuador y del mundo hoy." target="blank_" style="text-decoration:none; color:#000" href="'.$link.'">Quiero ver en mi navegador</a>';
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

	public function createJSONPHP($dat){
    	$datos = [
    		"notas" => [$this->fechaFormateada, $dat, $this->listaUsuario]
    	];
		$options = array(
		    'http' => array(
		        'method' => 'POST',
		        'header' => 'Content-type: application/x-www-form-urlencoded',
		        'content' => http_build_query($datos)
		    )
		);
		$context = stream_context_create($options);
		$content = file_get_contents("https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/json/boletin-diario/create.php", false, $context);
		return json_decode($content);
    }

    private function cropImagen($url = "", $newWidth = 600, $newHeight = 400, $compress= 75, $verticalPosition = 'arriba') {
	    $imagePath = './../img/boletin-diario/'; // Ruta donde se guardarán las imágenes

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
	            imagejpeg($cropped_image, $imageFilePath, $compress); // Calidad JPEG: 75 (valor entre 0 y 100)
	        } elseif ($extension === 'png') {
	            imagepng($cropped_image, $imageFilePath);
	        }

	        // Liberar memoria
	        imagedestroy($image);
	        imagedestroy($cropped_image);
	    }

	    // Obtener la nueva URL de la imagen
	    $src_url = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/img/boletin-diario/'.$currentYear.'/'.$currentMonth.'/'.$imageName;//$imagePath . $currentYear . '/' . $currentMonth . '/' . $imageName;
	    return $src_url; //. "?v=" . $this->generarNumeroRandom();
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

    public function getNotasNewTemplate($api_link){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $api_link,
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
		$dataNotas = json_decode($response);
		$rssNotas = $dataNotas->rss;
		$channel = $rssNotas->channel;
		$noticias = [];
		if(is_array($channel->item)){
			foreach ($channel->item as $key => $value) {
				$image = "";
				if(is_array($value->content)){
					$image = $value->content[0]->url;
				}else{
					$image = $value->content->url;
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
				$descripcion_formateado = preg_replace('/<img[^>]+\>/i', '', $descripcion);
				$descripcion = substr($descripcion_formateado, 0, 290).'...';
				$descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
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
			}
		}else{
			$value = $channel->item;
			$image = "";
			if(is_array($value->content)){
				$image = $value->content[0]->url;
			}else{
				$image = $value->content->url;
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
		}

		$firstArray = array_slice($noticias, 0, 1);
		$secondArray = array_slice($noticias, 1, 2);
		$thirdArray = array_slice($noticias, 3);
		$totalNoticia = count($noticias);
		
		$i_1 = 0;
		foreach ($firstArray as $key => &$v) {
			$v["link"] = $this->UTMLinks($i_1, $v["link"]);
			if($totalNoticia > 4){
				$v["image"] = $this->cropImagen($v["image"], 440, 250);
			}
			$i_1 = $i_1 + 1;
		}

		foreach ($secondArray as $key => &$v) {
			$v["link"] = $this->UTMLinks($i_1, $v["link"]);
			if($totalNoticia > 4){
				$v["image"] = $this->cropImagen($v["image"], 250, 225, 80);
			}
			
			$i_1 = $i_1 + 1;
		}
		
		foreach ($thirdArray as $key => &$v) {
			$v["link"] = $this->UTMLinks($i_1, $v["link"]);
			if($totalNoticia > 4){
				$v["image"] = $this->cropImagen($v["image"], 250, 175);
			}
			
			$i_1 = $i_1 + 1;
		}
		

		$finalArray = array($firstArray, $secondArray, $thirdArray);
		return $finalArray;

		// $id = $this->createJSONPHP($finalArray)->id;
		// $finalArray_2 = array($firstArray, $secondArray, $thirdArray, $id);
		// return $finalArray_2;
    }

    private function generarNumeroRandom() {
	   $numero = rand(0, 10000) / 100; // Genera un número aleatorio entre 0 y 10000 y lo divide por 100
	   $numero = round($numero, 2); // Redondea el número a 2 decimales
	   return $numero;
	}

    public function getNotasFormatRespaldo($api_link){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $api_link,
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
		$dataNotas = json_decode($response);
		$rssNotas = $dataNotas->rss;
		$channel = $rssNotas->channel;
		$noticias = [];
		if(is_array($channel->item)){
			foreach ($channel->item as $key => $value) {
				$image = "";
				if(is_array($value->content)){
					$image = $value->content[0]->url;
				}else{
					$image = $value->content->url;
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
				$descripcion_formateado = preg_replace('/<img[^>]+\>/i', '', $descripcion);
				$descripcion = substr($descripcion_formateado, 0, 290).'...';
				$descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
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
			}
		}else{
			$value = $channel->item;
			$image = "";
			if(is_array($value->content)){
				$image = $value->content[0]->url;
			}else{
				$image = $value->content->url;
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
		}

		return $noticias[0];

		// $id = $this->createJSONPHP($finalArray)->id;
		// $finalArray_2 = array($firstArray, $secondArray, $thirdArray, $id);
		// return $finalArray_2;
    }

    public function createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body){
        $curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.sendpulse.com/campaigns',
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS =>'{
		    "sender_name":"'.$sender_name.'",
		    "sender_email":"'.$sender_email.'",
		    "subject":"'.$subject.'",
		    "list_id":"'.$list_id.'",
		    "name":"'.$name.'",
		    "body": "'.$body.'"
		}',
		  CURLOPT_HTTPHEADER => array(
		    'Content-Type: application/json',
		    'Authorization: Bearer '.$this->getToken()
		  ),
		));

		$response = curl_exec($curl);
		curl_close($curl);
		//"send_date":"'.$this->fechaDeEnvio.'",
		return json_decode($response);
    }

    private function armarCorreo($name, $body, $list_id){
    	$getFecha = date("Y-m-d, H:i:s", time());
        $sender_name = "Ecuavisa Informa";
        $sender_email = $this->sender_email;
        $subject = $this->subject;
        $name = $name;
        $campaign = $this->createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body);
        return $campaign;
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

	private function calcularTiempoTranscurridoEnMinutos($fechaHora) {
	    date_default_timezone_set('America/Guayaquil'); // Reemplaza 'tu_zona_horaria' con la zona horaria que desees utilizar, por ejemplo, 'America/New_York' o 'Europe/Madrid'.
	    // Obtener la fecha y hora actual
	    $fechaHoraActual = new DateTime();
	    // Convertir la fecha y hora enviada al formato DateTime
	    $fechaHoraEnviada = DateTime::createFromFormat('Y-m-d H:i:s', $fechaHora);
	    // Calcular la diferencia de tiempo en minutos
	    $intervalo = $fechaHoraActual->diff($fechaHoraEnviada);
	    $minutosTranscurridos = $intervalo->days * 24 * 60 + $intervalo->h * 60 + $intervalo->i;
	    return $minutosTranscurridos;
	}

	private function estaEnRangoHorario() {
	    date_default_timezone_set('America/Guayaquil'); // Reemplaza 'tu_zona_horaria' con la zona horaria que desees utilizar, por ejemplo, 'America/New_York' o 'Europe/Madrid'.
	    $horaInicio = $this->horai;
	    $horaFin = $this->horaf;
	    $horaActual = date('H:i:s');

	    return ($horaActual >= $horaInicio && $horaActual <= $horaFin);
	}

    public function view(){
    	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		$getFecha = date("Y-m-d, H:i:s", time());

			$nombreNeswletter = $this->nombreNeswletter;
			$idTemplate = $this->idTemplate;//148832;//TEMPLATE CORREO
			$list_id = $this->listaUsuario;//LISTA DE USUARIOS
			// $numUsers = $this->getListUser($list_id);
			$numUsers = [0, 1];
			$notas = $this->getNotasNewTemplate('https://www.ecuavisa.com/rss/boletin-diario.json');

			$template = $this->getTemplate($idTemplate);
			$htmlTemplate = $this->base64ToHTML($template->body);



			$bloque_noticias = "";
			foreach ($notas[0] as $key => $nota) { 
				$bloque_noticias .= $this->getTemplatePHP($nota, "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/portada.php"); 
			}
			$bodyGenerar = str_replace("{{ bloque_noticias }}", $bloque_noticias, $htmlTemplate);



			$bloque_2_verticales = "";
			// foreach ($notas[1] as $key => $nota) { 
			$bloque_2_verticales .= $this->getTemplatePHP($notas[1], "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/2-notas.php"); 
			// }
			$bodyGenerar = str_replace("{{ bloque_2_verticales }}", $bloque_2_verticales, $bodyGenerar);


			$bloque_2_horizontales = "";
			// foreach ($notas[1] as $key => $nota) { 
			$bloque_2_horizontales .= $this->getTemplatePHP($notas[2], "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/2-notas-abajo.php"); 
			// }
			$bodyGenerar = str_replace("{{ bloque_2_horizontales }}", $bloque_2_horizontales, $bodyGenerar);

			// $bloque_3_horizontales_col_1 = "";
			// $bloque_3_horizontales_col_1 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-televistazo-19.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{noticiero_19}}", $bloque_3_horizontales_col_1, $bodyGenerar);

			// $bloque_3_horizontales_col_2 = "";
			// $bloque_3_horizontales_col_2 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-televistazo-13.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{noticiero_13}}", $bloque_3_horizontales_col_2, $bodyGenerar);

			// $bloque_3_horizontales_col_3 = "";
			// $bloque_3_horizontales_col_3 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-contacto-directo.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{contacto_directo}}", $bloque_3_horizontales_col_3, $bodyGenerar);


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

			// if(isset($_GET["view"])){
			// 	echo ($bodyContent);
			// 	exit();
			// }
			if(count($notas) > 0 && count($numUsers) > 0){
				if($this->estaEnRangoHorario()){
					$resp = $this->armarCorreo($nombreNeswletter, $this->HtmlToBase64($bodyContent), $list_id);
	        		echo json_encode(["respSendPulse"=>$resp,"resp"=>true, "message"=>"La campaña fue creada en la fecha ".$getFecha]);
					$this->logToFile("Crear campaña a SendPulse", array("accion" => "Crear campaña"));
	        		exit();
	        		// echo json_encode(["resp"=>true, "message"=>"Enviado."]);
	        		// exit();
				}
				echo json_encode(["resp"=>false, "message"=>"No se puede mandar la campaña por que la hora no corresponde a la acordada."]);
	        	exit();
			}
			echo json_encode(["resp"=>false, "message"=>"El Newsletter no fue enviado por que no existe notas que enviar"]);
	        exit();
    	}
    	echo "No tienes acceso";
    	exit();
    }

    public function preview(){
    	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		echo '<div style="max-width: 500px;margin-left: auto;margin-right: auto;padding:30px">';
			echo '<b>Subject: </b>'.$this->subject;
			echo '<br>';
			echo '<b>Descripción: </b>'.$this->descripcion;
			echo '<br>';
			echo '<b>ID Lista de usuario: </b>'.$this->listaUsuario;
			echo '<br>';
			echo '<b>Sender email: </b>'.$this->sender_email;
			echo '<br>';
			echo '<b>Fecha de envío: </b>'.$this->fechaDeEnvio;
			echo '<br>';
			echo '<b>Nombre de la plantilla: </b>'.$this->nombreNeswletter;
			echo '</div>';

    		$getFecha = date("Y-m-d, H:i:s", time());

			$nombreNeswletter = $this->nombreNeswletter;
			$idTemplate = $this->idTemplate;//148832;//TEMPLATE CORREO
			$list_id = $this->listaUsuario;//LISTA DE USUARIOS
			// $numUsers = $this->getListUser($list_id);
			$numUsers = [0, 1];
			$notas = $this->getNotasNewTemplate('https://www.ecuavisa.com/rss/boletin-diario.json');

			$template = $this->getTemplate($idTemplate);
			$htmlTemplate = $this->base64ToHTML($template->body);



			$bloque_noticias = "";
			foreach ($notas[0] as $key => $nota) { 
				$bloque_noticias .= $this->getTemplatePHP($nota, "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/portada.php"); 
			}
			$bodyGenerar = str_replace("{{ bloque_noticias }}", $bloque_noticias, $htmlTemplate);



			$bloque_2_verticales = "";
			// foreach ($notas[1] as $key => $nota) { 
			$bloque_2_verticales .= $this->getTemplatePHP($notas[1], "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/2-notas.php"); 
			// }
			$bodyGenerar = str_replace("{{ bloque_2_verticales }}", $bloque_2_verticales, $bodyGenerar);


			$bloque_2_horizontales = "";
			// foreach ($notas[1] as $key => $nota) { 
			$bloque_2_horizontales .= $this->getTemplatePHP($notas[2], "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/2-notas-abajo.php"); 
			// }
			$bodyGenerar = str_replace("{{ bloque_2_horizontales }}", $bloque_2_horizontales, $bodyGenerar);

			// $bloque_3_horizontales_col_1 = "";
			// $bloque_3_horizontales_col_1 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-televistazo-19.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{noticiero_19}}", $bloque_3_horizontales_col_1, $bodyGenerar);

			// $bloque_3_horizontales_col_2 = "";
			// $bloque_3_horizontales_col_2 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-televistazo-13.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{noticiero_13}}", $bloque_3_horizontales_col_2, $bodyGenerar);

			// $bloque_3_horizontales_col_3 = "";
			// $bloque_3_horizontales_col_3 .= $this->getTemplatePHP( 
			// 	$this->getNotasFormatRespaldo("https://www.ecuavisa.com/rss/nl-contacto-directo.json") , 
			// 	"https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/template/boletin-diario/ultimaseccionauzl.php"
			// ); 
			// $bodyGenerar = str_replace("{{contacto_directo}}", $bloque_3_horizontales_col_3, $bodyGenerar);


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

			echo $bodyContent;
			$this->logToFile("Ver contenido", array("accion" => "Ver correo"));
			exit();
    	}
    	echo "No tienes acceso";
    	exit();
    }
}

