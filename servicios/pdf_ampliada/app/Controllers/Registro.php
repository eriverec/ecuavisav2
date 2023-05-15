<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Registro extends BaseController{
    public function index(){
        return $this->response->setJSON([
            "resp" => false,
            "message" => "No tienes acceso"
        ]);
    }

    public function getArticle($idarticle){
        $json = file_get_contents("https://www.ecuavisa.com/news-portlet/getArticle/$idarticle.json");
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

    public function getRanking($idarticle = 5117800){
        $value = $this->getArticle($idarticle);
        $image = $this->getDetail($value->article->content->component, "Image");
        $titulo = $this->getDetail($value->article->content->component, "Headline");
        $Subheadline = $this->getDetail($value->article->content->component, "Subheadline");
        $link = $value->article->metadata->link[0]->href;
        $subseccion = $this->getDetailSubseccion($value->article->metadata->sections->section);
        $tituloSubseccion = $subseccion->name;
        $linkSubseccion = "https://www.ecuavisa.com$subseccion->url";
        
        $descripcion = $this->getDetail($value->article->content->component, "Text");
        $descripcion_formateado = $descripcion->__text;
        $descripcion = $descripcion_formateado;
        $descripcionFinal = str_replace('<a ', '<a style="color: #444;" ', $descripcion);
        $noticias = [
            "titulo" => $titulo->__text,
            "subheadline" => (isset($Subheadline->__text)?$Subheadline->__text:""),
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

    private function getDetail_2($list){
        $content = [];
        $titulo = "";
        if(is_array($list)){
            foreach ($list as $key => $value) {
                if($value->name == "Image"){
                    $content[] = '
                    <div style="background-image: url('.$value->remoteContent->href.'); background-repeat: no-repeat; background-size: cover; width: 100%; height: 300px;">
                    </div>';
                }
                if($value->name == "Headline"){
                    $titulo = $value->__text;
                    $content[] = "<h1>$value->__text</h1>";
                }
                if($value->name == "Subheadline"){
                    $content[] = "<small>$value->__text</small>";
                }
                if($value->name == "Text"){
                    $content[] = "<div>$value->__text</div>";
                }
                if($value->name == "h2"){
                    $content[] = "<h2>$value->__text</h2>";
                }
                if($value->name == "Image_Text"){
                    $content[] = '<img width="100%" class="img-principal" src="'.$value->remoteContent->href.'">';
                }
            }
        }
        return [$content, $titulo];
    }

    public function getRanking_2($idarticle){
        $value = $this->getArticle($idarticle);
        $data = $this->getDetail_2($value->article->content->component);
        return $data;
    }

    private function slugify($text, string $divider = '-'){
        // replace non letter or digits by divider
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);
        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);
        // trim
        $text = trim($text, $divider);
        // remove duplicate divider
        $text = preg_replace('~-+~', $divider, $text);
        // lowercase
        $text = strtolower($text);
        if (empty($text)) {
            return 'n-a';
        }
        return $text;
    }

    public function pdf($idarticle){
        if ($this->request->getMethod() == 'get') {
            $post = (object) $this->request->getGetPost();
            $hora = date("H-m-s", time());
            $mpdf = new \Mpdf\Mpdf(['default_font' => 'arial']);
            $articulo = $this->getRanking_2($idarticle);
            $html = view('informe/ampliada_2',[
                "nombre" => "Asistencias e inasistencias de empleados",
                "datos" => $articulo[0]
            ]);
            $mpdf->WriteHTML($html);
            $this->response->setHeader('Content-Type', 'application/pdf');

            //header('Content-Type: application/pdf');
            //$pdfFilePath ="uploads/informe/Salesreport-".time()."-download.pdf";

            $mpdf->Output($this->slugify($articulo[1])."-".$hora.".pdf", "D"); 
        }else{
            $this->response->setStatusCode(404, 'Error con la petición');
        }
    }
}