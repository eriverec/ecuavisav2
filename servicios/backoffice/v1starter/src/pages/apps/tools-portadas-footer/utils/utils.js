
export const guardarData = async (data) => {
  const dataString = JSON.stringify(data);
  const dataJson = JSON.parse(dataString);
  try {
    const response = await fetch('https://servicio-github-dynamic.vercel.app/live-web/portadas-footer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data_string: dataJson})
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return true;
  } catch (error) {
    console.error('Error al enviar datos:', error);
    return false;
  }
}

export const loadConfiguracion = async () => {
  try {
    const response = await fetch('https://cdn-ecuavisa.pages.dev/envivo/assets-dynamic/portada_footer.js');
    const text = await response.text();
    
    // Buscar el array JSON usando regex
    const jsonMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    
    if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en el archivo');
    }
    
    const config = JSON.parse(jsonMatch[0]);

    return config ?? [];
  } catch (error) {
    console.log('Error cargando configuración:', error);
    return [];
  }
}