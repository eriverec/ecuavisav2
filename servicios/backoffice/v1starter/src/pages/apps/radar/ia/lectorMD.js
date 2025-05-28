function lectorMD(markdown) {
    let html = markdown
      // Encabezados (de H6 a H1)
      .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
      .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
  
      // Negrita y cursiva
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
  
      // Código en línea
      .replace(/`(.*?)`/g, '<code>$1</code>')
  
      // Enlaces
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
  
      // Listas
      .replace(/^\s*[\-\*]\s+(.*)$/gm, '<li>$1</li>');
  
    // Agrupar <li> dentro de <ul>
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    html = html.replace(/<\/li>\s*<li>/g, '</li><li>'); // limpieza de separaciones extra
  
    // Dividir en párrafos según doble salto de línea
    html = html.split(/\n{2,}/).map(para => {
      // Evitar poner <p> en tags ya bloque como <h1>, <ul>, etc.
      const isBlockTag = /<(h[1-6]|ul|li|p|pre|blockquote)/i.test(para.trim());
      return isBlockTag ? para : `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  
    return html;
  }

  export default lectorMD;