import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape_google_profile_social_media(url):
    """
    Scraper para obtener redes sociales y seguidores de un perfil de Google
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        social_links = soup.find_all('a', class_='d5NbRd-EScbFb-JIbuQc-hSRGPd')
        
        redes_sociales = []
        redes_permitidas = ['Facebook', 'YouTube', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn']
        
        for link in social_links:
            nombre_element = link.find('div', class_='CaBPF')
            seguidores_element = link.find('div', class_='DnZpLc')
            
            if nombre_element and seguidores_element:
                nombre = nombre_element.text.strip()
                seguidores_raw = seguidores_element.text.strip()
                url_red = link.get('href', '')
                
                if nombre in redes_permitidas:
                    seguidores = seguidores_raw.replace(' followers', '').replace(' seguidores', '')
                    
                    redes_sociales.append({
                        'nombre': nombre,
                        'seguidores': seguidores,
                        'url': url_red
                    })
        
        return redes_sociales
    
    except Exception as e:
        print(f"Error al scrapear: {e}")
        return []

if __name__ == "__main__":
    url = "https://profile.google.com/cp/CgkvbS8wNTE0OV8"
    
    print(f"Ejecutando scraper - {datetime.now()}")
    resultados = scrape_google_profile_social_media(url)
    
    print("Redes Sociales encontradas:")
    print(json.dumps(resultados, indent=2, ensure_ascii=False))
    
    with open('redes_sociales.json', 'w', encoding='utf-8') as f:
        json.dump({
            'fecha_actualizacion': datetime.now().isoformat(),
            'redes_sociales': resultados
        }, f, indent=2, ensure_ascii=False)
    
    print("Datos guardados en redes_sociales.json")

