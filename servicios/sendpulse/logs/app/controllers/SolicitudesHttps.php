<?php

class SolicitudesHttps {
    private $gestionArchivos;
    private $typeProyect;
    private $contadorSolicitudes;

    public function __construct($list = array()) {
        $valoresFecto = array(
            "typeProyect" => "Local",
        );
        // Fusionar el array por defecto con el array proporcionado
        $resultado = array_merge($valoresFecto, $list);
        $this->typeProyect = $resultado["typeProyect"]; //Production - Local
    }

    public function getApiMethodGet($url){
        try {
            $this->contadorSolicitudes ++;
            // Ruta al certificado raíz descargado
            $certPath = 'C:/cacert.pem';
            $solicitud = array(
              CURLOPT_URL => $url,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'GET',
            );

            if($this->typeProyect != "Production"){
                $solicitud = array(
                  CURLOPT_URL => $url,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => '',
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 0,
                  CURLOPT_FOLLOWLOCATION => true,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => 'GET',
                  CURLOPT_CAINFO => $certPath,
                );
            }

            $curl = curl_init();
            curl_setopt_array($curl, $solicitud);
            $response = curl_exec($curl);
            curl_close($curl);
            return json_decode($response);
        } catch (Exception $e) {
            return 'Error al leer el archivo: ' .$e->getMessage();
        }
    }

    public function getApiMethodPost($url, $params) {
      try {
          $this->contadorSolicitudes++;
  
          // Ruta al certificado raíz descargado
          $certPath = 'C:/cacert.pem';
  
          // Configuración base para la solicitud
          $solicitud = [
              CURLOPT_URL => $url,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS => json_encode($params),
              CURLOPT_HTTPHEADER => [
                  'Content-Type: application/json; charset=UTF-8'
              ],
          ];
  
          // Si no es producción, usar el certificado
          if ($this->typeProyect != "Production") {
              $solicitud[CURLOPT_CAINFO] = $certPath;
          }
  
          // Inicializa y ejecuta cURL
          $curl = curl_init();
          curl_setopt_array($curl, $solicitud);
          $response = curl_exec($curl);
  
          // Manejo de errores cURL
          if (curl_errno($curl)) {
              throw new Exception(curl_error($curl));
          }
  
          curl_close($curl);
  
          // Retorna el JSON decodificado
          return json_decode($response, true);
  
      } catch (Exception $e) {
          return 'Error al leer el archivo: ' . $e->getMessage();
      }
  }
}
