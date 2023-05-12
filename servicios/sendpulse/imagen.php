<?php 

// URL de la imagen que quieres obtener
$url = 'https://www.ecuavisa.com/binrepository/fvz22wpwyaixrtd_931927_20230505224911.jpg';

// Obtener imagen de la URL
$image = imagecreatefromstring(file_get_contents($url));
$originalWidth = imagesx($image);
$originalHeight = imagesy($image);
// Redimensionar imagen

$new_width = 800;
$new_height = $new_width * ($originalHeight / $originalWidth);

$resized_image = imagecreatetruecolor($new_width, $new_height);
imagecopyresampled($resized_image, $image, 0, 0, 0, 0, $new_width, $new_height, imagesx($image), imagesy($image));

// Recortar imagen
$cropped_image = imagecrop($resized_image, ['x' => 0, 'y' => 30, 'width' => $new_width, 'height' => 420]);

// Convertir imagen a base64
ob_start();
imagepng($cropped_image);
$base64_image = base64_encode(ob_get_clean());
$src_url = 'data:image/png;base64,' . $base64_image . '';
// Imprimir imagen en una etiqueta img
echo '<img height="auto" src="'.$src_url.'" alt="Imagen recortada">';

 ?>