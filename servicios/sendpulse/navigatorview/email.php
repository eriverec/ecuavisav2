<?php
ini_set("display_errors", 1);
header('Access-Control-Allow-Origin: *');

/**
 * Modificado el 27 de octubre del 2024 - CR
 */
class Email_preview{
    private $sndplstoken;
    private $tituloCp;
    private $idCp;
	private $dominio;

    function __construct(){
		$this->dominio = "https://services.ecuavisa.com/sendpulse";
        $this->sndplstoken = $this->init_token();
    }

    private function init_token(){
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => $this->dominio.'/getApi.php',
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
        // echo $response.$this->dominio.'/getApi.php';
        return $response;
    }

    private function crearSlug($texto) {
        // Convierte todo a minúsculas
        $texto = mb_strtolower($texto);
        // Reemplaza caracteres especiales
        $texto = preg_replace('/[^\w\s-]/', '', $texto);
        // Reemplaza espacios por guiones
        $texto = str_replace(' ', '-', $texto);
        // Elimina guiones consecutivos
        $texto = preg_replace('/-+/', '-', $texto);
        // Elimina guiones al inicio y final
        $texto = trim($texto, '-');
        return $texto;
    }

    private function httpsGet($url = ""){
        // consulta los detalles de la campaña seleccionada  
        $cpDetailsUrl = $url; 
        $bearer2 = 'Authorization: Bearer '.$this->sndplstoken;
        $curl2 = curl_init();
        curl_setopt_array($curl2, array(
          CURLOPT_URL => $cpDetailsUrl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => [$bearer2] //array( ),
        ));
        $campaignDetails = curl_exec($curl2);
        curl_close($curl2);
        // fin de la consulta de detalles de campaña
        $decodedCampaignDetails = json_decode($campaignDetails, true);
        return $decodedCampaignDetails;
    }

    private function getSendPulseCampaigns($offset = 0, $limit = 25){
        $sendpulseCpUrl = 'https://api.sendpulse.com/addressbooks/'.$this->idCp.'/campaigns?limit='.$limit.'&offset='.$offset; // id de lista de ej 565083
        // fin de la consulta de campañas al api de sendpulse
        return $this->httpsGet($sendpulseCpUrl);
    }

    private function getIdCampaign($CampaignList){
        $tituloEmailGet = $this->crearSlug($this->tituloCp);
        foreach($CampaignList as $email)  {
            $tituloEmail = $this->crearSlug($email['task_name']);
            if( $tituloEmailGet == $tituloEmail ){
                return $email['task_id'];
            }
        }
        return 0;
    }

    private function getCampaign($campaignId = 0){
        // consulta los detalles de la campaña seleccionada  
        $cpDetailsUrl = 'https://api.sendpulse.com/campaigns/'.$campaignId;
        return $this->httpsGet($cpDetailsUrl);
    }

    public function init(){
        $query_string = $_SERVER['QUERY_STRING'];
        $params = array();
        parse_str($query_string, $params);
        $this->tituloCp = $params['titulo'];
        $this->idCp = $params['lista'];

        $limit = 75;
        $offset = 0 * $limit;
        $CampaignList = $this->getSendPulseCampaigns($offset, $limit);
        // return json_encode($CampaignList);

        $idCampaign = $this->getIdCampaign($CampaignList);

        $bandera = 0;
        // Hace un blucle repetitivo por cada lista hasta encontrar el nombre correspondiente en sendpulse, al final solo se requiere el idCampaña
        // Para no hacer un buble infinito, la variable bandera limita el while hasta un máximo de conteo
        while($idCampaign == 0 && $bandera < 50){
            $offset = $offset + 1;
            $bandera = $bandera + 1;
            $offset = $bandera * $limit;
            $CampaignList = $this->getSendPulseCampaigns($offset, $limit);
            $idCampaign = $this->getIdCampaign($CampaignList);
            // echo $bandera;
            // echo $offset;
            // echo "<br>";
            // echo $idCampaign;
            // echo "<br>";
            // echo json_encode($CampaignList);
        }
        return $this->getCampaign($idCampaign)["permalink"];
    }
}


$ins = new Email_preview();
$link = $ins->init();
if (is_object($link)) {
    echo "Lo siento, vista previa no disponible";
    exit();
}
// echo $link;
header("Location: ".$link."");
exit();