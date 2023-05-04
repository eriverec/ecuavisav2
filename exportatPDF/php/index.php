
<?
$html = file_get_contents('ejemplo.html');
$dom = new DOMDocument();
$dom->loadHTML($html);

// Obtener todos los elementos div del DOM
$divs = $dom->getElementsByClassName('headline');

// Obtener todos los elementos img del DOM
$imgs = $dom->getElementsByClassName('multimedia');

// Obtener todos los elementos de texto del DOM
$text_nodes = $dom->getElementsByClassName('text');


/* ********************** */

// Instalar la librería mpdf utilizando Composer
require __DIR__ . '/vendor/autoload.php';

// Configurar mpdf con una nueva instancia
$mpdf = new \Mpdf\Mpdf();

// Define la salida HTML
$html = 'hola como estan';

// Agregar el HTML al documento PDF
$mpdf->WriteHTML($html);

// Genera el documento PDF
$mpdf->Output('documento.pdf', 'D');