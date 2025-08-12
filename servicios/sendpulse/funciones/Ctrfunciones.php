<?php
class Ctrfunciones {
	public $desfaseMaximo;
	public $typeProyect;
	public $folder;
	public $folderPrimary;
	private $dominio;

	function __construct($list = array()){
		$valoresFecto = array(
			"desfaseMinutosMax" => 15,
			"folder" => "opinion",
			"folderPrimary" => "sendpulsev",
			"typeProyect" => "Production",
		);
		// Fusionar el array por defecto con el array proporcionado
    	$resultado = array_merge($valoresFecto, $list);
    	$this->desfaseMaximo = $resultado["desfaseMinutosMax"];
    	$this->folder = $resultado["folder"];
    	$this->folderPrimary = $resultado["folderPrimary"];
    	$this->typeProyect = $resultado["typeProyect"];
		$this->dominio =  "https://services.ecuavisa.com/sendpulse";
	}

	public function validarAcceso($data) {
	    // Decodificar el JSON
	    // $data = json_decode($json);
	    
	    // Establecer la zona horaria a la tuya (por ejemplo, "America/Guayaquil")
	    date_default_timezone_set('America/Guayaquil');
	    setlocale(LC_TIME, 'es_ES.UTF-8');

	    // Obtener el método como índice
	    $methodIndex = intval($data->horarioEjecucion->method);
	    // Verificar que el índice es válido
	    if ($methodIndex >= 1 && $methodIndex <= count($data->horarioEjecucion->horario)) {
	        $horario = $data->horarioEjecucion->horario[$methodIndex - 1];

	        // Obtener la fecha y hora actual
	        $fechaActual = new DateTime();
	        $horaActual = intval($fechaActual->format('H'));
	        $minutoActual = intval($fechaActual->format('i'));

	        // Validar según el tipo de método
	        switch ($methodIndex) {
	            case 1:
	                // Método 1: No se requiere validación específica
	                return true;
	            case 2:
	                // Método 2: Validar hora y minuto
	                $horaModel = intval($horario->horaModel ?? 0);
	                $minutoModel = intval($horario->minutoModel ?? 0);
	                return $this->validarHoraMinuto($horaActual, $minutoActual, $horaModel, $minutoModel);
	            case 3:
	                // Método 3: Validar día, hora y minuto
	                $diasModel = $horario->diaModel ?? [];
	                $horaModel = intval($horario->horaModel ?? 0);
	                $minutoModel = intval($horario->minutoModel ?? 0);
	                return $this->validarDiaHoraMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel);
	            case 4:
	                // Método 4: Validar día, hora, mes y minuto
	                $diasModel = $horario->diaModel ?? 1;
	                $horaModel = intval($horario->horaModel ?? 0);
	                $minutoModel = intval($horario->minutoModel ?? 0);
	                $mesModel = $horario->mesModel ?? "Enero";
	                return $this->validarDiaHoraMesMinuto_2($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel);
	            case 5:
	                // Método 5: Validar día, hora, mes y minuto (similar a Método 4)
	                $diasModel = $horario->diaModel ?? [];
	                $horaModel = intval($horario->horaModel ?? 0);
	                $minutoModel = intval($horario->minutoModel ?? 0);
	                $mesModel = $horario->mesModel ?? [];
	                return $this->validarDiaHoraMesMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel);
	        }
	    }
	    return false;
	    // Si no se cumple ninguna de las condiciones anteriores, se devuelve false (acceso no permitido)    
	}

	public function haPasadoDesfase($data) {
		// Decodificar el JSON
	    // $data = json_decode($json);
	    
	    // Establecer la zona horaria a la tuya (por ejemplo, "America/Guayaquil")
	    date_default_timezone_set('America/Guayaquil');
	    setlocale(LC_TIME, 'es_ES.UTF-8');

	    // Obtener el método como índice
	    $methodIndex = intval($data->horarioEjecucion->method);
	    // Verificar que el índice es válido
	    if ($methodIndex >= 1 && $methodIndex <= count($data->horarioEjecucion->horario)) {
	        $horario = $data->horarioEjecucion->horario[$methodIndex - 1];

	        // Obtener la fecha y hora actual
	        $fechaActual = new DateTime();
	        $horaActual = intval($fechaActual->format('H'));
	        $minutoActual = intval($fechaActual->format('i'));

	        $horaModel = intval($horario->horaModel ?? 0);
	        $minutoModel = intval($horario->minutoModel ?? 0);
	        // Calcular los minutos totales desde la medianoche para ambos momentos de tiempo
		    $minutosTotalesActual = $horaActual * 60 + $minutoActual;
		    $minutosTotalesModel = $horaModel * 60 + $minutoModel;

		    // Calcular la diferencia en minutos entre los dos momentos de tiempo
		    $diferenciaEnMinutos = $minutosTotalesActual - $minutosTotalesModel;
		    if($diferenciaEnMinutos < 0){
		    	$diferenciaEnMinutos = $diferenciaEnMinutos * -1;
		    }
		    // Definir el desfase máximo permitido (15 minutos)
		    

		    // Verificar si la diferencia es mayor o igual al desfase máximo
		    
		    return $diferenciaEnMinutos >= $this->desfaseMaximo;
	    }
	    return null;
	}

	private function validarDiaHoraMesMinuto_2($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel) {

		$traduccionesDias = [
		    "Sunday" => "Domingo",
		    "Saturday" => "Sábado",
		    "Friday" => "Viernes",
		    "Thursday" => "Jueves",
		    "Wednesday" => "Miércoles",
		    "Tuesday" => "Martes",
		    "Monday" => "Lunes"
		];

		$traduccionesMeses = [
		    "January" => "Enero",
		    "February" => "Febrero",
		    "March" => "Marzo",
		    "April" => "Abril",
		    "May" => "Mayo",
		    "June" => "Junio",
		    "July" => "Julio",
		    "August" => "Agosto",
		    "September" => "Septiembre",
		    "October" => "Octubre",
		    "November" => "Noviembre",
		    "December" => "Diciembre"
		];

	    // Validar el día de la semana, la hora, el mes y los minutos con un desfase de 15 minutos
	    
	    $diaActual = date('d');
	    // echo $diaActual;
	    $horaMinutoActual = $horaActual * 60 + $minutoActual;
	    $horaMinutoModel = $horaModel * 60 + $minutoModel;
	    $mesActual = date('F');

		// $nombreDia = $traduccionesDias[$diaActual];

		$nombreMes = $traduccionesMeses[$mesActual];

		// echo abs($horaMinutoActual - $horaMinutoModel);

	    return ($diaActual == $diasModel) && in_array($nombreMes, [$mesModel]) && abs($horaMinutoActual - $horaMinutoModel) <= $this->desfaseMaximo && $this->estaEnRangoHorario(str_pad($horaModel, 2, '0', STR_PAD_LEFT), str_pad($minutoModel, 2, '0', STR_PAD_LEFT));
	}

	private function validarDiaHoraMesMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel) {

		$traduccionesDias = [
		    "Sunday" => "Domingo",
		    "Saturday" => "Sábado",
		    "Friday" => "Viernes",
		    "Thursday" => "Jueves",
		    "Wednesday" => "Miércoles",
		    "Tuesday" => "Martes",
		    "Monday" => "Lunes"
		];

		$traduccionesMeses = [
		    "January" => "Enero",
		    "February" => "Febrero",
		    "March" => "Marzo",
		    "April" => "Abril",
		    "May" => "Mayo",
		    "June" => "Junio",
		    "July" => "Julio",
		    "August" => "Agosto",
		    "September" => "Septiembre",
		    "October" => "Octubre",
		    "November" => "Noviembre",
		    "December" => "Diciembre"
		];

	    // Validar el día de la semana, la hora, el mes y los minutos con un desfase de 15 minutos
	    
	    $diaActual = date('l');
	    $horaMinutoActual = $horaActual * 60 + $minutoActual;
	    $horaMinutoModel = $horaModel * 60 + $minutoModel;
	    $mesActual = date('F');

		$nombreDia = $traduccionesDias[$diaActual];

		$nombreMes = $traduccionesMeses[$mesActual];

	    return in_array($nombreDia, $diasModel) && in_array($nombreMes, $mesModel) && abs($horaMinutoActual - $horaMinutoModel) <= $this->desfaseMaximo && $this->estaEnRangoHorario(str_pad($horaModel, 2, '0', STR_PAD_LEFT), str_pad($minutoModel, 2, '0', STR_PAD_LEFT));
	}

	private function validarDiaHoraMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel) {
		$traduccionesDias = [
		    "Sunday" => "Domingo",
		    "Saturday" => "Sábado",
		    "Friday" => "Viernes",
		    "Thursday" => "Jueves",
		    "Wednesday" => "Miércoles",
		    "Tuesday" => "Martes",
		    "Monday" => "Lunes"
		];

	    // Validar el día de la semana, la hora y los minutos con un desfase de 15 minutos
	    
	    $diaActual = date('l');
	    $horaMinutoActual = $horaActual * 60 + $minutoActual;
	    $horaMinutoModel = $horaModel * 60 + $minutoModel;

	    $nombreDia = $traduccionesDias[$diaActual];

	    return in_array($nombreDia, $diasModel) && abs($horaMinutoActual - $horaMinutoModel) <= $this->desfaseMaximo && $this->estaEnRangoHorario(str_pad($horaModel, 2, '0', STR_PAD_LEFT), str_pad($minutoModel, 2, '0', STR_PAD_LEFT));
	}

	private function validarHoraMinuto($horaActual, $minutoActual, $horaModel, $minutoModel) {
	    // Validar la hora y los minutos con un desfase de 15 minutos
	    
	    $minutosTotalesActual = $horaActual * 60 + $minutoActual;
	    $minutosTotalesModel = $horaModel * 60 + $minutoModel;

	    return abs($minutosTotalesActual - $minutosTotalesModel) <= $this->desfaseMaximo && $this->estaEnRangoHorario(str_pad($horaModel, 2, '0', STR_PAD_LEFT), str_pad($minutoModel, 2, '0', STR_PAD_LEFT));
	}

	public function calcularTiempoTranscurridoEnMinutos($fechaHora) {
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

    public function cropImagen($url = "", $newWidth = 600, $newHeight = 400, $compress= 75, $verticalPosition = 'arriba') {
	    if($url == ""){
	    	return "";
	    }
	    // $imagePath = './img/'.$this->folder.'/'; // Ruta donde se guardarán las imágenes
    	$imagePath = './img/';
	    // Obtener la fecha actual
	    $currentDate = date("Y/m/d");
	    $currentYear = date("Y");
	    $currentMonth = date("m");

	    // Crear carpetas si no existen
	    if (!file_exists($imagePath)) {
	        mkdir($imagePath);
	    }

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
	    if (file_exists($imageFilePath)) {
	    	unlink($imageFilePath); // Eliminar la imagen si existe
	    }

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
	        $start_x = intval($start_x);
	        $start_y = intval($start_y);
	        $finalWidth = intval($finalWidth);
	        $finalHeight = intval($finalHeight);
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
	    // Verifica si se está utilizando HTTPS
		$protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";

		// Obtiene el nombre del host (localhost en este caso)
		$host = $_SERVER['HTTP_HOST'];

		// Obtiene la ruta relativa del archivo actual
		$uri = $_SERVER['REQUEST_URI'];

		// Construye la URL completa
		$urlActual = $protocolo . "://" . $host . $uri;
	    $src_url = $this->typeProyect == "Production"?$this->dominio.'/'.$this->folder.'/img/'.$currentYear.'/'.$currentMonth.'/'.$imageName:'../../'.$this->folderPrimary.'/'.$this->folder.'/img/'.$currentYear.'/'.$currentMonth.'/'.$imageName;//$imagePath . $currentYear . '/' . $currentMonth . '/' . $imageName;
	    return $src_url; //. "?v=" . $this->generarNumeroRandom();
	}

    public function base64ToHTML($base64){
        return base64_decode($base64);
    }

    public function HtmlToBase64($html){
        return base64_encode($html);
    }

	public function createJSONPHP($data = array(), $idUnico = ""){
		$valoresFecto = array(
			"fechaFormateada" => "",
			"data" => array(),
			"listaUsuario" => "",
			"newsletter" => "opinion"
		);
		$resultado = array_merge($valoresFecto, $data);

		$directorio = "./archivos/";
		if (!file_exists($directorio)) {
	        mkdir($directorio);
	    }
		// $idUnico = $this->generarIDUnico();
		$nombre_archivo = $directorio.$idUnico.".json";
		file_put_contents($nombre_archivo, json_encode($resultado));
		return $idUnico;
    }

    public function generarIDUnico($texto = "user") {
	    $uniqid = uniqid();
	    $idUnico = $texto . "_" . $uniqid;
	    return $idUnico;
	}

	public function getJson($idUnico){
		$directorio = "./archivos/";
		$nombre_archivo = $directorio.$idUnico.".json";
		if (!file_exists($nombre_archivo)) {
		    return null;
		}

		$json = file_get_contents($nombre_archivo);
		$items = json_decode($json, true);
		return $items;
    }

    public function getTemplatePHP($data, $url){
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

    private function estaEnRangoHorario($hora, $minuto) {
	    date_default_timezone_set('America/Guayaquil'); // Reemplaza 'tu_zona_horaria' con la zona horaria que desees utilizar, por ejemplo, 'America/New_York' o 'Europe/Madrid'.
	    // Obtén la hora de inicio a partir de $horai
	    $horaInicio = "$hora:$minuto:00";
	    // Calcula la hora final sumando 15 minutos a la hora de inicio
	    $horaObjeto = new DateTime($horaInicio);
	    $horaObjeto->add(new DateInterval('PT15M'));
	    $horaFin = $horaObjeto->format('H:i:s');
	    $horaActual = date('H:i:s');
	    return ($horaActual >= $horaInicio && $horaActual <= $horaFin);
	}

	public function minificar_html($html) {
	    $html = preg_replace('/\s+/', ' ', $html); // Eliminar espacios en blanco
	    $html = preg_replace('/<!--(.|\s)*?-->/', '', $html); // Eliminar comentarios
	    return $html;
	}
}