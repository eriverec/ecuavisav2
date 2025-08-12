<?php
require __DIR__ . '/SolicitudesHttps.php';

class LogToFile {
    private $directorio;
    private $tamanioLote = 50000;
    private $maxSize = 10485760; // 10 MB
    private $https;

    public function __construct() {
        $this->directorio = dirname(__DIR__, 2) . '/json/';
        if (!is_dir($this->directorio)) {
            mkdir($this->directorio, 0777, true);
        }
        $this->https = new SolicitudesHttps(array(
            "typeProyect" => "Local", //Local - Production
        ));
    }

    public function listarArchivos() {
        return array_values(array_filter(scandir($this->directorio), function ($file) {
            return preg_match('/\.json$/', $file);
        }));
    }

    public function leerArchivo($file) {
        $ruta = $this->directorio . $file;
        if (!file_exists($ruta)) return [];

        $contenido = file_get_contents($ruta);
        $array = json_decode($contenido, true);

        return is_array($array) ? $array : [];
    }

    public function guardarArchivo($archivo) {
        $data = (object) $archivo;
        $file = $data->file ?? 'default.json';
        $ruta = $this->directorio . $file;

        file_put_contents($ruta, json_encode($archivo, JSON_PRETTY_PRINT));
    }

    public function limpiarArchivo($archivo) {
        file_put_contents($this->directorio . $archivo, "");
        return true;
    }

    /**
     * Añadir un registro al archivo correspondiente
     */
    public function add(array $registro) {
        if (!isset($registro['file'])) {
            throw new Exception("El registro debe contener la clave 'file'.");
        }

        $file = $registro['file'];
        $ruta = $this->directorio . $file;

        // Crear archivo si no existe
        if (!file_exists($ruta)) {
            file_put_contents($ruta, json_encode([], JSON_PRETTY_PRINT));
        }

        // Verificar tamaño del archivo
        if (filesize($ruta) > $this->maxSize) {
            // Limpiar contenido si supera 10MB
            $this->limpiarArchivo($file);
            file_put_contents($ruta, json_encode([$registro], JSON_PRETTY_PRINT));
            $this->envioEmailNuevoRegistro($registro);
            return true;
        }

        // Leer contenido actual
        $contenido = file_get_contents($ruta);
        $data = json_decode($contenido, true);

        if (!is_array($data)) {
            $data = [];
        }

        // Agregar el nuevo registro
        $data[] = $registro;

        // Guardar nuevamente
        file_put_contents($ruta, json_encode($data, JSON_PRETTY_PRINT));
        $this->envioEmailNuevoRegistro($registro);
        return true;
    }

    /**
     * Listar registros con paginado, filtro por fechas y ordenamiento descendente por fecha
     */
    public function listar(
        int $page = 1, 
        int $limit = 10, 
        ?string $fechai = null, 
        ?string $fechaf = null, 
        ?string $newsletter = null, 
        ?string $search = null, 
        ?string $type = null
    ) {
        $archivos = $this->listarArchivos();
        $registros = [];

        if($newsletter){
            $data = $this->leerArchivo($newsletter);
            if (is_array($data)) {
                $registros = $data;
            }
        }else{
            // Cargar todos los registros
            foreach ($archivos as $archivo) {
                $data = $this->leerArchivo($archivo);
                if (is_array($data)) {
                    $registros = array_merge($registros, $data);
                }
            }
        }

        $registros = array_unique($registros, SORT_REGULAR);

        // Filtro por rango de fechas si aplica
        if ($fechai && $fechaf) {
            $fechaiTime = strtotime($fechai . " 00:00:00");
            $fechafTime = strtotime($fechaf . " 23:59:59");

            $registros = array_filter($registros, function ($item) use ($fechaiTime, $fechafTime) {
                if (!isset($item['datetime'])) return false;
                $ts = strtotime($item['datetime']);
                return $ts >= $fechaiTime && $ts <= $fechafTime;
            });
        }

        // Búsqueda de coincidencias en campos campaign y campaign_title
        if ($search) {
            $registros = array_filter($registros, function ($item) use ($search) {
                return (stripos($item['campaign'] ?? '', $search) !== false)
                    || (stripos($item['campaign_title'] ?? '', $search) !== false)
                    || (stripos($item['type'] ?? '', $search) !== false)
                    || (stripos($item['action'] ?? '', $search) !== false);
            });
        }

        // Filtro por tipo si aplica
        if ($type) {
            $registros = array_filter($registros, function ($item) use ($type) {
                return $item['type'] == $type;
            });
        }

        // Ordenar por fecha descendente
        usort($registros, function ($a, $b) {
            $timeA = isset($a['datetime']) ? strtotime($a['datetime']) : 0;
            $timeB = isset($b['datetime']) ? strtotime($b['datetime']) : 0;
            return $timeB <=> $timeA; // Descendente
        });

        // Total de registros
        $total = count($registros);

        // Paginado
        $offset = ($page - 1) * $limit;
        $paginated = array_slice($registros, $offset, $limit);

        return [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit),
            'data' => array_values($paginated)
        ];
    }


    public function sendEmail($newsletter, $description = "", $subject = "", $respError = "", $campaign_title = ""){
        $errorArray = $respError;
        $respSendPulse = (array) $errorArray['respSendPulse'] ?? [];
        $codError = $respSendPulse['error_code'] ?? "";
        $messageError = $respSendPulse['message'] ?? "";
        $fecha = $errorArray['fecha'] ?? "";
        
        $templateHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="es">
            <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>Template mensaje de error</title>
            <style type="text/css">#outlook a {
                padding:0;
            }
            .b {
                mso-style-priority:100!important;
                text-decoration:none!important;
            }
            a[x-apple-data-detectors] {
                color:inherit!important;
                text-decoration:none!important;
                font-size:inherit!important;
                font-family:inherit!important;
                font-weight:inherit!important;
                line-height:inherit!important;
            }
            .a {
                display:none;
                float:left;
                overflow:hidden;
                width:0;
                max-height:0;
                line-height:0;
                mso-hide:all;
            }
            @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left }      .co p, .co ul li, .co ol li, .co a { font-size:14px!important }   *[class="gmail-fix"] { display:none!important }        .cc table, .cd table, .ce table, .cc, .ce, .cd { width:100%!important; max-width:600px!important }  .adapt-img { width:100%!important; height:auto!important }                                                         }
            @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
            </head>
            <body style="width:100%;font-family:arial, helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
            <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#fafafa"></v:fill>
                        </v:background>
                    <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA;">
                <tr>
                <td valign="top" style="padding-top:25px;padding-bottom:25px">
                <table class="cc" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="co" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:500px" role="none">
                        <tr>
                        <td align="left" style="Margin:0;padding-bottom:5px;padding-top:20px;padding-left:20px;padding-right:20px">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                            <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                <td align="left" style="padding:0;Margin:0;padding-top:20px"><h1 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:25px;font-style:normal;font-weight:bold;color:#e74c3c;text-align:center">Error de envío de Newsletter</h1><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#e74c3c;font-size:14px;display:none"><br></p></td>
                                </tr>
                                <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">Se ha detectado un problema que requiere atención</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px;display:none"><br></p></td>
                                </tr>
                                <tr>
                                <td align="center" style="padding:20px;Margin:0;font-size:0">
                                <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:0px;width:100%;margin:0px"></td>
                                    </tr>
                                </table></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table></td>
                        </tr>
                        <tr>
                        <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-bottom:40px">
                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:22.5px;color:#666666;font-size:15px">Estimado/a,</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:22.5px;color:#666666;font-size:15px">Te informamos que ha ocurrido un error durante el intento de envío de una campaña de marketing programada en nuestro sistema.</p></td>
                                </tr>
                            </table></td>
                            </tr>
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#fdf2f2" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#fdf2f2;border-radius:10px" role="presentation">
                                <tr>
                                <td align="left" style="padding:25px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:24px;color:#721c24;font-size:16px"><strong>Motivo</strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:22.5px;color:#721c24;font-size:15px">'.$messageError.' <strong>Cod. '.$codError.'</strong></p></td>
                                </tr>
                            </table></td>
                            </tr>
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f8f9fa" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#f8f9fa;border-radius:10px;margin-top:20px" role="presentation">
                                <tr>
                                <td align="left" style="Margin:0;padding-bottom:15px;padding-top:25px;padding-left:25px;padding-right:25px">
                                <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border:none" class=" cke_show_border" role="presentation">
                                    <tr style="border-bottom:1px solid #e9ecef">
                                    <td style="padding:0;Margin:0;border:none;color:#495057;padding-top:15px;padding-bottom:15px;font-size:15px" width="30%"><strong>Fecha y Hora:</strong></td>
                                    <td style="padding:0;Margin:0;border:none;padding-top:15px;padding-bottom:15px;font-size:14px" width="70%">'.$fecha.'</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #e9ecef">
                                    <td style="padding:0;Margin:0;border:none;color:#495057;padding-top:15px;padding-bottom:15px;font-size:15px" width="30%"><strong>Subject:</strong></td>
                                    <td style="padding:0;Margin:0;border:none;padding-top:15px;padding-bottom:15px;font-family:arial, helvetica, sans-serif;font-size:14px" width="70%">'.$subject.'</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #e9ecef">
                                    <td style="padding:0;Margin:0;border:none;color:#495057;padding-top:15px;padding-bottom:15px;font-size:15px" width="30%"><strong>Nombre:</strong></td>
                                    <td style="padding:0;Margin:0;border:none;padding-top:15px;padding-bottom:15px;font-family:arial, helvetica, sans-serif;font-size:14px" width="70%">'.$newsletter.'</td>
                                    </tr>
                                    <tr>
                                    <td style="padding:0;Margin:0;border:none;color:#495057;padding-top:15px;padding-bottom:15px;font-size:15px" width="30%"><strong>Cod. Error:</strong></td>
                                    <td style="padding:0;Margin:0;border:none;padding-top:15px;padding-bottom:15px;font-family:arial, helvetica, sans-serif;font-size:14px" width="70%">'.$codError.'</td>
                                    </tr>
                                </table></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table></td>
                        </tr>
                    </table></td>
                    </tr>
                </table></td>
                </tr>
            </table>
            </div>
            </body>
            </html>';

        return $this->https->getApiMethodPost("https://email-sendpulse.vercel.app/sendpulse", array(
            "sesionState" => "OK",
            "emailData" => $templateHTML, //Correo
            "emailFrom" => "ecuavisainforma@ecuavisa.com", // correo De
            "emailTo" => "everai@ecuavisa.com, crojano@ecuavisa.com, gholguin@ecuavisa.com, jbarahona@ecuavisa.com",
            // "emailTo" => "crojano@ecuavisa.com",
            "subject" => "Error al crear la campaña de sendpulse, ".$newsletter,
            "CCVisible" => "aarmas@ecuavisa.com, mjaramillob@ecuavisa.com, xcabrera@ecuavisa.com, lguzman@ecuavisa.com, bpilozo@ecuavisa.com, dmaggi@ecuavisa.com"
        )); //croura@ecuavisa.com, cmoreno@ecuavisa.com, 
    }

    public function envioEmailNuevoRegistro($registro){
        if($registro['action'] == "create_campaign" && $registro['type'] == "error"){
            $campaign = $registro['campaign'] ?? "";
            $description = $registro['description'] ?? "";
            $subject = $registro['subject'] ?? "";
            $respError = $registro['resp'] ?? "";
            $campaign_title = $registro['campaign_title'] ?? "";
            $resp = $this->sendEmail($campaign, $description, $subject, $respError, $campaign_title);
            return $this->add([
                "ip" => $registro['ip'] ?? "",
                "user_agent" => $registro['user_agent'] ?? "",
                "action" => "send_email",
                "datetime" => $registro['datetime'] ?? "",
                "file" => $registro['file'] ?? "",
                "campaign" => $registro['campaign'] ?? "",
                "campaign_title" => $registro['campaign_title'] ?? "",
                "description" => $registro['description'] ?? "",
                "send_method" => "automático",
                "type" => "success",
                "subject" => $subject,
                "resp" => $registro['resp'] ?? [],
                "notas" => $registro['notas'] ?? []
            ]);
        }

        return false;
    }
}
