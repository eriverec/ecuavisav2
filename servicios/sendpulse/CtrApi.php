<?php
class CtrApi {

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
        $this->token = $this->initToken();
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

	public function initToken(){
		try {
			$infoData = isset($_GET['info']) ? true: false;
			date_default_timezone_set('America/Guayaquil');
			// Ruta al archivo JSON
			$rutaArchivo = './token.json';
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
					CURLOPT_TIMEOUT => 15, // 15 segundos timeout
        			CURLOPT_CONNECTTIMEOUT => 15, // 15 segundos para conexión
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
				$error = curl_error($curl);
				$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
				curl_close($curl);
				
				if ($error) {
					throw new Exception("Timeout o error en endpoint después de 15 segundos: " . $error);
				}
				
				if ($httpCode != 200) {
					throw new Exception("Error en endpoint - Status: " . $httpCode);
				}

				$newFile = array(
					"fecha" => date('Y-m-d H:i:s', time()),
					"token" => json_decode($response)->access_token
				);
				file_put_contents($rutaArchivo, json_encode($newFile));

				if($infoData){
					echo json_encode([
						"resp" => true,
						"data" => $newFile
					]);
					exit();
				}

				return json_decode($response)->access_token;
			}

			if($infoData){
				echo json_encode([
					"resp" => true,
					"data" => $datos
				]);
				exit();
			}
			return $datos["token"];
		} catch (\Throwable $th) {
			return json_encode([
				"resp" => false,
				"mensaje" => $th->getMessage()
			]);
		}
    }

    public function getToken(){
    	return $this->token;
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

}

