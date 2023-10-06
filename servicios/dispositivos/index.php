<?php
// Función para verificar si el usuario está en un dispositivo iOS
function isIOS() {
    return stripos($_SERVER['HTTP_USER_AGENT'], 'iPad') !== false
        || stripos($_SERVER['HTTP_USER_AGENT'], 'iPhone') !== false
        || stripos($_SERVER['HTTP_USER_AGENT'], 'iPod') !== false;
}

// URL del enlace inteligente para iOS
// $iosDeepLink = 'https://www.ecuavisa.com/?dispositivoecuavisa2023=ios';
$iosDeepLink = 'https://www.ecuavisa.com/?dispositivoecuavisa2023=ios';

// URL del enlace inteligente para Android
$androidDeepLink = 'https://play.google.com/store/apps/details?id=com.digitalproserver.ecuavisa&hl=es_EC&gl=US';

// URL de la página web de redirección si la aplicación no está instalada
$webFallbackLink = 'https://play.google.com/store/apps/details?id=com.digitalproserver.ecuavisa&hl=es_EC&gl=US';

// Función para redirigir al enlace inteligente adecuado
function redirectToApp() {
    global $iosDeepLink, $androidDeepLink;
    if (isIOS()) {
        header('Location: ' . $iosDeepLink);
    } else {
        header('Location: ' . $androidDeepLink);
    }
}

// Función para redirigir a la página web de redirección
function redirectToWebFallback() {
    global $webFallbackLink;
    header('Location: ' . $webFallbackLink);
}

// Lógica para redirigir al usuario al enlace inteligente o a la página web de redirección
if (isIOS() || stripos($_SERVER['HTTP_USER_AGENT'], 'Android') !== false) {
    // Si el usuario está en iOS o Android, intentar abrir la aplicación
    redirectToApp();
} else {
    // Si el usuario no está en iOS ni Android, redirigirlo a la página web de redirección
    redirectToWebFallback();
}