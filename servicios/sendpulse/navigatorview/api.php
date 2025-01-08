<?php
ini_set("display_errors", 1);
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$query_string = $_SERVER['QUERY_STRING'];
$params = array();
parse_str($query_string, $params);
$tituloCp = $params['titulo'];
$idCp = $params['lista']; // ejemplo de parametro en url (?lista=565083)
// echo $tituloCp; // titulo de la campaña
// echo $params['lista']; // id de la lista

// consulta de token
// mandamos a una variable Url el link de la consulta del token
$url = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/getApi.php";
// Realizamos la consulta y recuperamos el contenido de la URL, asignandola a una variable
$sndplstoken = file_get_contents($url);
// echo $sndplstoken; 
// fin consula de token


// consulta las campañas al api de sendpulse 
$sendpulseCpUrl = 'https://api.sendpulse.com/addressbooks/'.$idCp.'/campaigns'; // id de lista de ej 565083
$bearer = 'Authorization: Bearer '.$sndplstoken ;
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => $sendpulseCpUrl,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => [$bearer] //array( ),
));
$campaignList = curl_exec($curl);
curl_close($curl);
// fin de la consulta de campañas al api de sendpulse

$decodedCampaignList = json_decode($campaignList, true);

foreach($decodedCampaignList as $email)  {
    
    if( $tituloCp == $email['task_name']){
        $campaignId = $email['task_id'];
        // echo("<br> seleccionada");
        // echo($email['task_id']);


        // consulta los detalles de la campaña seleccionada  
        $cpDetailsUrl = 'https://api.sendpulse.com/campaigns/'.$campaignId; 
        $bearer2 = 'Authorization: Bearer '.$sndplstoken ;
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
        // forzamos a leer tdos los parametros del json
        foreach($decodedCampaignDetails as $key => $value) {
            // echo ('<br>');
            // echo $key . ' = ' . $value . PHP_EOL;
            if($key == "permalink"){
                echo ( ' { "emailLink":"'.$value.'" } ' );
            }
        }
    }
}

// echo $campaignList;
?>