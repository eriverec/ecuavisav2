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
    public function listar(int $page = 1, int $limit = 10, ?string $fechai = null, ?string $fechaf = null, ?string $newsletter = null, ?string $search = null) {
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

        // Búsqueda de coincidencias en campos campaign y campaign_title
        if ($search) {
            $registros = array_filter($registros, function ($item) use ($search) {
                return (stripos($item['campaign'] ?? '', $search) !== false)
                    || (stripos($item['campaign_title'] ?? '', $search) !== false)
                    || (stripos($item['type'] ?? '', $search) !== false)
                    || (stripos($item['action'] ?? '', $search) !== false);
            });
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


    public function sendEmail($newsletter, $error = ""){
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
            @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left }      .co p, .co ul li, .co ol li, .co a { font-size:14px!important }   *[class="gmail-fix"] { display:none!important }   .cl, .cl h1, .cl h2, .cl h3 { text-align:left!important }    .cf table, .cg, .ch { width:100%!important } .cc table, .cd table, .ce table, .cc, .ce, .cd { width:100%!important; max-width:600px!important }      .bv { padding-bottom:20px!important }                                                   }
            @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
            </head>
            <body style="width:100%;font-family:arial, helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
            <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#fafafa"></v:fill>
                        </v:background>
                    <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
                <tr>
                <td valign="top" style="padding:0;Margin:0">
                <table class="cc" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="co" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center" role="none">
                        <tr>
                        <td align="left" style="Margin:0;padding-bottom:5px;padding-top:20px;padding-left:20px;padding-right:20px">
                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                <td align="right" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px"></p></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table></td>
                        </tr>
                    </table></td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0" class="cc" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="co" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                        <tr>
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://services.ecuavisa.com/gestor/2025/logo-ecuavisa-200-x-200.png" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:57px" width="57"></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table></td>
                        </tr>
                        <tr>
                        <td class="esdev-adapt-off" align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                        <table class="esdev-mso-table" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                            <tr>
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table class="cg" cellspacing="0" cellpadding="0" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                <tr>
                                <td class="bv" align="left" style="padding:0;Margin:0;width:300px">
                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td align="right" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0px">
                                    <table width="15%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td style="padding:0;Margin:0;border-bottom:3px solid #2927b9;background:none 0% 0% repeat scroll #00000000;height:1px;width:100%;margin:0px"></td>
                                        </tr>
                                    </table></td>
                                    </tr>
                                </table></td>
                                </tr>
                            </table></td>
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table class="ch" cellspacing="0" cellpadding="0" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                <tr>
                                <td align="left" style="padding:0;Margin:0;width:300px">
                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0px">
                                    <table width="15%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td style="padding:0;Margin:0;border-bottom:3px solid #333333;background:#00000000 none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td>
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
                <table class="cc" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                    <td align="center" style="padding:0;Margin:0">
                    <table class="co" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                        <tr>
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr>
                                <td class="cl" align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">No se pudo completar el envío programado para el newsletter.<br></p></td>
                                </tr>
                                <tr>
                                <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Estimado/a,</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Te informamos que ha ocurrido un error durante el intento de envío de una campaña de marketing programada en nuestro sistema.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p><h3 style="Margin:0;line-height:22.8px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:19px;font-style:normal;font-weight:bold;color:#ff0000">
                                Detalles del Error:</h3><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Campaña: <strong>'.$newsletter.'</strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Mensaje de error: <strong>'.$error.'</strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br>Saludos,<br></p></td>
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
            "emailFrom" => "gholguin@ecuavisa.com", // correo De
            "emailTo" => "everai@ecuavisa.com",
            "subject" => "Error al crear la campaña de sendpulse, ".$newsletter,
            "CCVisible" => "cmoreno@ecuavisa.com, aarmas@ecuavisa.com, croura@ecuavisa.com, mjaramillob@ecuavisa.com, xcabrera@ecuavisa.com, jbarahona@ecuavisa.com, lguzman@ecuavisa.com, bpilozo@ecuavisa.com, crojano@ecuavisa.com"
        ));
    }

    public function envioEmailNuevoRegistro($registro){
        if($registro['action'] == "create_campaign" && $registro['type'] == "error"){
            $resp = $this->sendEmail($registro['campaign'], $registro['description']);
            return $this->add([
                "ip" => $registro['ip'],
                "user_agent" => $registro['user_agent'],
                "action" => "send_email",
                "datetime" => $registro['datetime'],
                "file" => $registro['file'],
                "campaign" => $registro['campaign'],
                "campaign_title" => $registro['campaign_title'],
                "description" => $registro['description'],
                "send_method" => "automático",
                "type" => "success"
            ]);
        }

        return false;
    }
}
