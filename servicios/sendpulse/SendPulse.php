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

    private function customTemplate($nota){
    	$line = '<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0"><tbody><tr style="border-color:transparent"><td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top"><div class="block-divider" style="font-size:14px; line-height:1.5; padding-left:0px; padding-right:0px; padding-top:10px; padding-bottom:10px"><hr id="iout_block_13_element_0" style="margin:0; border-top-style:solid; border-top-width:1px; border-top-color:#2927b9; border-bottom:0; border-left:0; border-right:0"></div></td></tr></tbody></table>';

    	$htmlBlock = '<table class="ecuavisa_link" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; width:100%" border="0" width="100%">
		   <tbody>
		      <tr style="border-color:transparent">
		         <td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top">
		            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; width:100%" border="0" width="100%">
		               <tbody>
		                  <tr style="border-color:transparent">
		                     <th width="500" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc responsive " align="left" valign="top">
		                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		                           <tbody>
		                              <tr style="border-color:transparent">
		                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_9_element_0" style="border-collapse:separate; font-size:14px; line-height:1.5; border-top-left-radius:2px; border-top-right-radius:2px; border-bottom-left-radius:2px; border-bottom-right-radius:2px; overflow:hidden">
		                                       <tbody>
		                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif">
		                                             <td class="content-cell" width="440" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:20px; padding-bottom:24px" valign="top">
		                                                <div id="wout_block_9_element_0" style="font-size:14px; line-height:1.5; width:100%; height:220; display:block" width="100%" height="220">
		                                                   <a class="link_img" href="'.$nota["link"].'" style="text-decoration:none; color:#0089bf; display:block">
		                                                      <div style="width:100%;height:280px;background-image:url('.$nota["image"].');background-size: cover;background-repeat: no-repeat;background-position: top;">

		                                                      </div>
		                                                      <!--<img border="0" width="440" height="auto" class="desktop  sp-img " align="left" alt="'.$nota["titulo"].'" src="'.$nota["image"].'" iout_block_9_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; margin:0; border-top-left-radius:2px; border-top-right-radius:2px; border-bottom-left-radius:2px; border-bottom-right-radius:2px; display:block; -ms-interpolation-mode:bicubic">-->
		                                                      <!--[if !mso]><!-->
		                                                      <div style="font-size:14px; line-height:1.5; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img " align="left" alt="'.$nota["titulo"].'" src="'.$nota["image"].'" iout_block_9_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; border-top-left-radius:2px; border-top-right-radius:2px; border-bottom-left-radius:2px; border-bottom-right-radius:2px; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:100% !important"></div>
		                                                      <!--<![endif]-->
		                                                   </a>
		                                                </div>
		                                                <div style="font-size:14px; line-height:1.5; clear:both"></div>
		                                             </td>
		                                          </tr>
		                                       </tbody>
		                                    </table>
		                                 </td>
		                              </tr>
		                           </tbody>
		                        </table>
		                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0;margin-top: 15px;">
		                           <tbody>
		                              <tr style="border-color:transparent">
		                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_4" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:Verdana, Geneva, sans-serif; font-family-short:verdana; font-weight:normal; color:#2927b9; margin:0; overflow:hidden">
		                                       <tbody>
		                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif">
		                                             <td class="content-cell padding-top-0 padding-bottom-0" width="440" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0; padding-bottom:0" valign="top">
		                                                <p itemprop="headline" canonicalurl="/estadio/nacional/trasladan-en-ambulancia-al-arquero-de-el-nacional-luego-de-desplomarse-tres-veces-en-pleno-juego-HK2279696" idart="2279696" style="line-height:1.2; margin:0 0 10px; font-size:inherit; color:#2927b9; font-family:Verdana, Geneva, sans-serif; font-weight:normal; padding:0"><strong><span style="font-size: 18px; color: #2927b9;"><a href="'.$nota["subseccion"]["link"].'" style="text-decoration:none; color:inherit">'.$nota["subseccion"]["titulo"].'</a></span></strong></p>
		                                                <div style="font-size:14px; line-height:1.5; clear:both"></div>
		                                             </td>
		                                          </tr>
		                                       </tbody>
		                                    </table>
		                                 </td>
		                              </tr>
		                           </tbody>
		                        </table>
		                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		                           <tbody>
		                              <tr style="border-color:transparent">
		                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_4" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:Verdana, Geneva, sans-serif; font-family-short:verdana; font-weight:normal; color:#060127; margin:0; overflow:hidden">
		                                       <tbody>
		                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif">
		                                             <td class="content-cell padding-top-0 padding-bottom-0" width="440" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0; padding-bottom:0" valign="top">
		                                                <p canonicalurl="/deportes/futbol-internacional/portero-de-peru-quedo-en-libertad-tras-agredir-a-un-policia-en-madrid-XH4786642" idart="4786642" style="line-height:1.5; margin:0 0 10px; font-size:inherit; color:#060127; font-family:Verdana, Geneva, sans-serif; font-weight:normal; padding:0"><span style="color: #060127;"><strong><span style="font-size: 18px;"><a href="'.$nota["link"].'" style="text-decoration:none; color:#060127">'.$nota["titulo"].'</a></span></strong></span></p>
		                                                <div style="font-size:14px; line-height:1.5; clear:both"></div>
		                                             </td>
		                                          </tr>
		                                       </tbody>
		                                    </table>
		                                 </td>
		                              </tr>
		                           </tbody>
		                        </table>
		                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		                           <tbody>
		                              <tr style="border-color:transparent">
		                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_37" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:Verdana, Geneva, sans-serif; font-family-short:verdana; font-weight:normal; margin:0; overflow:hidden">
		                                       <tbody>
		                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif">
		                                             <td class="content-cell padding-top-0 padding-bottom-0" width="440" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0; padding-bottom:0" valign="top">
		                                                '.$nota["descripcion"].'
		                                             </td>
		                                          </tr>
		                                       </tbody>
		                                    </table>
		                                 </td>
		                              </tr>
		                           </tbody>
		                        </table>
		                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		                           <tbody>
		                              <tr style="border-color:transparent">
		                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		                                    <div class="block-divider" style="font-size:14px; line-height:1.5; padding-left:0px; padding-right:0px; padding-top:27px; padding-bottom:27px">
		                                       <hr id="iout_block_13_element_0" style="margin:0; border-top-style:solid; border-top-width:1px; border-top-color:#2927b9; border-bottom:0; border-left:0; border-right:0">
		                                    </div>
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

		return $htmlBlock;
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

    public function getNotas($api_link){
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
				$descripcion = substr($descripcion_formateado, 0, 400).'...';
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
			$descripcion = substr($descripcion_formateado, 0, 400).'...';
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
		return $noticias;
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

    public function getArticle($idarticle){
        $json = file_get_contents("https://www.ecuavisa.com/news-portlet/getArticle/$idarticle.json");
		return json_decode($json);
    }

    public function getRankings($num = 3){
        $json = file_get_contents("https://www.ecuavisa.com/restapi/ranking/article/visits/$num");
		return json_decode($json);
    }

    private function getDetail($list, $type){
    	if(is_array($list)){
    		foreach ($list as $key => $value) {
	    		if($type == $value->name){
	    			return $value;
	    		}
	    	}
    	}
    	return [];
    }

    private function getDetailSubseccion($list){
    	if(is_array($list)){
    		foreach ($list as $key => $value) {
	    		if(count(explode('/', $value->url)) > 2){
	    			return $value;
	    		}
	    	}
    	}
    	return [];
    }

    public function getRanking($idarticle){
    	$value = $this->getArticle($idarticle);
		$image = $this->getDetail($value->article->content->component, "Image");
		$titulo = $this->getDetail($value->article->content->component, "Headline");
		$link = $value->article->metadata->link[0]->href;
		$subseccion = $this->getDetailSubseccion($value->article->metadata->sections->section);
		$tituloSubseccion = $subseccion->name;
		$linkSubseccion = "https://www.ecuavisa.com$subseccion->url";
		
		$descripcion = $this->getDetail($value->article->content->component, "Text");
		$descripcion_formateado = preg_replace('/<img[^>]+\>/i', '', $descripcion->__text);
		$descripcion = substr($descripcion_formateado, 0, 400).'...';
		$descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
		$noticias = [
			"titulo" => $titulo->__text,
			"link" => $link,
			"descripcion" => $descripcionFinal,
			"subseccion" => [
				"titulo" => str_replace('-', ' ', strtoupper($tituloSubseccion)),
				"link" => $linkSubseccion
			],
			"image" => $image->remoteContent->href
		];
		return $noticias;
    }

    private function noticias($name, $body, $list_id){
    	$getFecha = date("Y-m-d", time());
        $sender_name = "ecuavisa.com";
        $sender_email = $this->sender_email;
        $subject = "Newsletter noticias - ".$getFecha;
        $name = $name;
        $campaign = $this->createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body);
        return $campaign;
    }

    private function estadio($name, $body, $list_id){
    	$getFecha = date("Y-m-d", time());
        $sender_name = "ecuavisa.com";
        $sender_email = $this->sender_email;
        $subject = "Newsletter estadio - ".$getFecha;
        $name = $name;
        $campaign = $this->createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body);
        return $campaign;
    }

    private function rankinUltimasNoticias($name, $body, $list_id){
    	$getFecha = date("Y-m-d", time());
        $sender_name = "ecuavisa.com";
        $sender_email = $this->sender_email;
        $subject = "Newsletter últimas noticias del día - ".$getFecha;
        $name = $name;
        $campaign = $this->createCampaigns($sender_name, $sender_email, $subject, $list_id, $name, $body);
        return $campaign;
    }

    public function view(){
    	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    		if (isset($_GET['action'])) {
    			$get = (object) $_GET;
    			$getFecha = date("Y-m-d, h:i:s", time());
    			switch ($get->action) {
    				case 'estadio':
    					$idTemplate = 148832;
    					$list_id = 564325;//564489
    					$numUsers = $this->getListUser($list_id);
    					$notas = $this->getNotas('https://www.ecuavisa.com/rss/boletin-estadio.json');
    					$template = $this->getTemplate($idTemplate);
	        			$htmlTemplate = $this->base64ToHTML($template->body);
    					$notasHtml = "";
    					foreach ($notas as $key => $nota) { $notasHtml .= $this->customTemplate($nota); }
    					$bodyGenerar = str_replace("{{ bloque_noticias }}", $notasHtml, $htmlTemplate);
    					$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
    					$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
    					$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
    					/*$name, $body, $list_id*/
    					$bodyContent = "";
				        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
						    $bodyContent = $matches[1];
						}
    					if(count($notas) > 0 && count($numUsers) > 0){
    						$resp = $this->estadio("Newsletter diario estadio ".$getFecha, $this->HtmlToBase64($bodyContent), $list_id);
				        	echo json_encode(["respSendPulse"=>$resp,"resp"=>true, "message"=>"La campania fue creada en la fecha ".$getFecha, "num_usuario" => count($numUsers), "num_notas" => count($notas)]);
				        	exit();
    					}
    					echo json_encode(["resp"=>false, "message"=>"El Newsletter no fue enviado por que no existe notas que enviar", "num_usuario" => count($numUsers), "num_notas" => count($notas)]);
				        exit();
    					break;
    				case 'ranking':
    					//ZONA DE PRUEBAS
    					$notas = $this->getRankings(3)->data->id;
    					$template = $this->getTemplate(148832);
    					$list_id = 564325;
    					$numUsers = $this->getListUser($list_id);
	        			$htmlTemplate = $this->base64ToHTML($template->body);
    					$notasHtml = "";
    					for ($i=0; $i < count($notas) ; $i++) { 
    						$notasHtml .= $this->customTemplate($this->getRanking($notas[$i]));
    					}
    					$bodyGenerar = str_replace("{{ bloque_noticias }}", $notasHtml, $htmlTemplate);
    					$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
    					$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
    					$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
    					/*$name, $body, $list_id*/
    					$bodyContent = "";
				        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
						    $bodyContent = $matches[1];
						}
    					$resp = $this->rankinUltimasNoticias("Newsletter diario últimas noticias ".$getFecha, $this->HtmlToBase64($bodyContent), $list_id);
			        	echo json_encode(["respSendPulse"=>$resp,"resp"=>true, "message"=>"La campania fue creada en la fecha ".$getFecha, "num_usuario" => count($numUsers)]);
			        	exit();
    					break;
    				case 'ranking_p':
    					//ZONA DE PRUEBAS
    					$notas = $this->getRankings(3)->data->id;
    					$template = $this->getTemplate(148832);
    					$list_id = 564325;
    					$numUsers = $this->getListUser($list_id);
	        			$htmlTemplate = $this->base64ToHTML($template->body);
    					$notasHtml = "";
    					for ($i=0; $i < count($notas) ; $i++) { 
    						$notasHtml .= $this->customTemplate($this->getRanking($notas[$i]));
    					}
    					$bodyGenerar = str_replace("{{ bloque_noticias }}", $notasHtml, $htmlTemplate);
    					$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
    					$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
    					$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
    					/*$name, $body, $list_id*/
    					$bodyContent = "";
				        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
						    $bodyContent = $matches[1];
						}
    					echo $bodyContent;
    					exit();
    					break;
    				case 'notas':
    					//ZONA DE PRUEBAS
    					$notas = $this->getNotas('https://www.ecuavisa.com/rss/boletin-estadio.json');
    					$template = $this->getTemplate(148832);
    					$list_id = 565120;
    					$numUsers = $this->getListUser($list_id);
	        			$htmlTemplate = $this->base64ToHTML($template->body);
    					$notasHtml = "";
    					foreach ($notas as $key => $nota) {
    						$notasHtml .= $this->customTemplate($nota);
    					}
    					$bodyGenerar = str_replace("{{ bloque_noticias }}", $notasHtml, $htmlTemplate);
    					$bodyGenerar = str_replace("{{contador_notas}}", count($notas) , $bodyGenerar);
    					$bodyGenerar = str_replace("Enviado a través de", "" , $bodyGenerar);
    					$bodyGenerar = str_replace('<img class="small_img" style="height:32px !important; line-height:100%; outline:0; text-decoration:none; border:0; width:132px !important" src="https://img.stat-pulse.com/img/my/emailservice/sendpulse-reward-logo-green.png" alt="SendPulse" border="0" vspace="2" width="132" height="32px !important">', "" , $bodyGenerar);
				        $bodyContent = "";
				        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $bodyGenerar, $matches)) {
						    $bodyContent = $matches[1];
						}
				        echo json_encode($this->getRanking(5117800));
				        exit();
    					break;
    				case 'template':
    					//ZONA DE PRUEBAS
	    				$template = $this->getTemplate(148832);
	        			$html = $this->base64ToHTML($template->body);
				        echo $html;
				        exit();
    					break;
    				case 'rankin_json':
	    				$notas = $this->getRankings(5)->data->id;
    					$notasHtml = [];
    					for ($i=0; $i < count($notas) ; $i++) { 
    						$notasHtml[] = $this->getRanking($notas[$i]);
    					}
    					$json_data = json_encode($notasHtml);
    					file_put_contents('masvisto.json', $json_data);
				        exit();
    					break;

    				default:
	                	echo "No tienes acceso";
	                	exit();
	                	break;
    			}
    		}
    	}
    	echo "No tienes acceso";
    	exit();
    }
}
