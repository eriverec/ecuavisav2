<?php 


function validarAcceso($json) {

    // Decodificar el JSON
    $data = json_decode($json);
    
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
                return validarHoraMinuto($horaActual, $minutoActual, $horaModel, $minutoModel);
            case 3:
                // Método 3: Validar día, hora y minuto
                $diasModel = $horario->diaModel ?? [];
                $horaModel = intval($horario->horaModel ?? 0);
                $minutoModel = intval($horario->minutoModel ?? 0);
                return validarDiaHoraMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel);
            case 4:
                // Método 4: Validar día, hora, mes y minuto
                $diasModel = $horario->diaModel ?? [];
                $horaModel = intval($horario->horaModel ?? 0);
                $minutoModel = intval($horario->minutoModel ?? 0);
                $mesModel = $horario->mesModel ?? [];
                return validarDiaHoraMesMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel);
            case 5:
                // Método 5: Validar día, hora, mes y minuto (similar a Método 4)
                $diasModel = $horario->diaModel ?? [];
                $horaModel = intval($horario->horaModel ?? 0);
                $minutoModel = intval($horario->minutoModel ?? 0);
                $mesModel = $horario->mesModel ?? [];
                return validarDiaHoraMesMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel);
        }
    }

    // Si no se cumple ninguna de las condiciones anteriores, se devuelve false (acceso no permitido)
    
}

function validarHoraMinuto($horaActual, $minutoActual, $horaModel, $minutoModel) {
    // Validar la hora y los minutos con un desfase de 15 minutos
    $desfaseMaximo = 15;
    $minutosTotalesActual = $horaActual * 60 + $minutoActual;
    $minutosTotalesModel = $horaModel * 60 + $minutoModel;

    return abs($minutosTotalesActual - $minutosTotalesModel) <= $desfaseMaximo;
}

function validarDiaHoraMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel) {
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
    $desfaseMaximo = 15;
    $diaActual = date('l');
    $horaMinutoActual = $horaActual * 60 + $minutoActual;
    $horaMinutoModel = $horaModel * 60 + $minutoModel;

    $nombreDia = $traduccionesDias[$diaActual];

    return in_array($nombreDia, $diasModel) && abs($horaMinutoActual - $horaMinutoModel) <= $desfaseMaximo;
}

function validarDiaHoraMesMinuto($diasModel, $horaActual, $minutoActual, $horaModel, $minutoModel, $mesModel) {

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
    $desfaseMaximo = 15;
    $diaActual = date('l');
    $horaMinutoActual = $horaActual * 60 + $minutoActual;
    $horaMinutoModel = $horaModel * 60 + $minutoModel;
    $mesActual = date('F');

	$nombreDia = $traduccionesDias[$diaActual];

	$nombreMes = $traduccionesMeses[$mesActual];

    return in_array($nombreDia, $diasModel) && in_array($nombreMes, $mesModel) && abs($horaMinutoActual - $horaMinutoModel) <= $desfaseMaximo;
}

echo validarAcceso('{
	"horarioEjecucion": {
      "method": "5",
      "horario": [
        {
          "value": 1,
          "minutoModel": null
        },
        {
          "value": 2,
          "horaModel": null,
          "minutoModel": null
        },
        {
          "value": 3,
          "diaModel": null,
          "horaModel": null,
          "minutoModel": null
        },
        {
          "value": 4,
          "diaModel": null,
          "horaModel": null,
          "mesModel": null,
          "minutoModel": null
        },
        {
          "value": 5,
          "diaModel": [
            "Domingo",
            "Sábado",
            "Viernes",
            "Jueves",
            "Miercoles",
            "Martes",
            "Lunes"
          ],
          "horaModel": 10,
          "mesModel": [
            "Diciembre",
            "Noviembre",
            "Octubre",
            "Septiembre",
            "Agosto"
          ],
          "minutoModel": 25
        }
      ]
    }
}'
);
 ?>