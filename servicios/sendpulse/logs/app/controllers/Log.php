<?php
require __DIR__ . '/LogToFile.php';
class Log {
    private $logToFile;
    private $maxFileSize = 1048576 * 10; // 10MB en bytes

    public function __construct() {
        $this->logToFile = new LogToFile();
    }

    public function listar() {
        try {
            $page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;
            $limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 10;
            $fechai = isset($_GET["fechai"]) ? $_GET["fechai"] : null;
            $fechaf = isset($_GET["fechaf"]) ? $_GET["fechaf"] : null;
            $newsletter = isset($_GET["newsletter"]) ? $_GET["newsletter"] : null;
            $search = isset($_GET["search"]) ? $_GET["search"] : null;
            $type = isset($_GET["type"]) ? $_GET["type"] : null;
            return $this->logToFile->listar($page, $limit, $fechai, $fechaf, $newsletter, $search, $type);
        } catch (Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }

    public function addDatos() {
        try {
            $body = file_get_contents('php://input');
            $data = json_decode($body, true);
    
            if (!isset($data["file"])) {
                return ["error" => "Formato incorrecto"];
            }

            $post = (object) $data;
            $ip = $post->ip;
            $user_agent = $post->user_agent;
            $action = $post->action;
            $datetime = $post->datetime;
            $file = $post->file;
            $campaign = $post->campaign;
            $campaign_title = $post->campaign_title ?? '';
            $description = $post->description ?? '';
            $send_method = $post->send_method ?? '';
            $type = $post->type ?? '';
            // Guardar solo los nuevos datos en el nuevo archivo
            $this->logToFile->add([
                "ip" => $ip,
                "user_agent" => $user_agent,
                "action" => $action,
                "datetime" => $datetime,
                "file" => $file,
                "campaign" => $campaign,
                "campaign_title" => $campaign_title,
                "description" => $description,
                "send_method" => $send_method,
                "type" => $type
            ]);
    
            return ["resp" => true, "mensaje" => "Datos guardados correctamente"];
        } catch (Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }

    public function envioEmailNuevoRegistro(){
        $campaign = "Ecuavisa Informa 7AM 2025-08-11, 16:09:37";
        $error = "Error al crear campaña - {\"respSendPulse\":{\"id\":\"sdaskdask\"},\"resp\":true,\"fecha\":\"2025-08-11 16:01:02\"}";
        $response = $this->logToFile->sendEmail($campaign, $error);
        return $response;
    }
    
}
