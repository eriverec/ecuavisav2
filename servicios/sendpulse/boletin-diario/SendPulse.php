<?php
class SendPulse {

	private $token;
	private $sender_email;

	function __construct(){
        $this->token = $this->initToken();
        $this->sender_email = "suscripciones@ecuavisa.com";
    }

	public function initToken(){
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

    private function cropImagen($url){
    	// Obtener imagen de la URL
		$image = imagecreatefromstring(file_get_contents($url));
		$originalWidth = imagesx($image);
		$originalHeight = imagesy($image);
		// Redimensionar imagen

		$new_width = 800;
		$new_height = $new_width * ($originalHeight / $originalWidth);

		$resized_image = imagecreatetruecolor($new_width, $new_height);
		imagecopyresampled($resized_image, $image, 0, 0, 0, 0, $new_width, $new_height, imagesx($image), imagesy($image));

		// Recortar imagen
		$cropped_image = imagecrop($resized_image, ['x' => 0, 'y' => 30, 'width' => $new_width, 'height' => 420]);

		// Convertir imagen a base64
		ob_start();
		imagepng($cropped_image);
		$base64_image = base64_encode(ob_get_clean());
		$src_url = 'data:image/png;base64,' . $base64_image . '';
		return $src_url;
    }

    private function imgSeparador($link_category){
    	/*VERDE: 0*/
    	/*OTRO: 1*/
    	$imagenes = ["https://estadisticas.ecuavisa.com/sites/gestor/Tools%2Fsendpulse%2FVector%2016.png", "https://estadisticas.ecuavisa.com/sites/gestor/Tools%2Fsendpulse%2FVector%2017.png"];
    	$frase = strtolower($link_category);
		$palabra = strtolower("deportes");
    	if(strpos(strtolower($frase), $palabra) !== false){
			return array("#2bb76b", $imagenes[0]);
		}
    	return array("#ff006b", $imagenes[1]);
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
				$tituloSubseccion = explode("/", $value->link)[4];
				$linkSubseccion = explode($tituloSubseccion, $value->link)[0].$tituloSubseccion;
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
			$tituloSubseccion = explode("/", $value->link)[4];
			$linkSubseccion = explode($tituloSubseccion, $value->link)[0].$tituloSubseccion;
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

		$finalArray = array($firstArray, $secondArray, $thirdArray);
		return $finalArray;
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
		return json_decode($response);
    }

    private function armarCorreo($name, $body, $list_id){
    	$getFecha = date("Y-m-d", time());
        $sender_name = "ecuavisa.com";
        $sender_email = $this->sender_email;
        $subject = "Newsletter diario - ".$getFecha;
        $name = $name;
        $campaign = $this->createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body);
        return $campaign;
    }

    public function view(){
    	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		$getFecha = date("Y-m-d, h:i:s", time());
			$idTemplate = 148832;//TEMPLATE CORREO
			$list_id = 565083;//LISTA DE USUARIOS
			$numUsers = $this->getListUser($list_id);
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


			$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
			$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
			$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
			/*$name, $body, $list_id*/
			$bodyContent = "";
	        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
			    $bodyContent = $matches[1];
			}

			// echo ($bodyContent);
			// exit();
			if(count($notas) > 0 && count($numUsers) > 0){
				$resp = $this->armarCorreo("Newsletter diario ".$getFecha, $this->HtmlToBase64($bodyContent), $list_id);
	        	echo json_encode(["respSendPulse"=>$resp,"resp"=>true, "message"=>"La campania fue creada en la fecha ".$getFecha, "num_usuario" => count($numUsers), "num_notas" => count($notas)]);
	        	exit();
			}
			echo json_encode(["resp"=>false, "message"=>"El Newsletter no fue enviado por que no existe notas que enviar", "num_usuario" => count($numUsers), "num_notas" => count($notas)]);
	        exit();
    	}
    	echo "No tienes acceso";
    	exit();
    }
}

