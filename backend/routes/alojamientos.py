import os
import requests
from flask import Blueprint, request, jsonify, abort
from dotenv import load_dotenv

from utiles import calcular_distancia_km

load_dotenv()
HOTELS_API_KEY = os.environ.get("HOTELS_API_KEY", "")
# En el .env: USAR_MOCK=1 fuerza los hoteles de ejemplo (demo estable,
# sin gastar peticiones de la API). Sin esa línea, o poniendolo en 0, se usa la API real.
USAR_MOCK = os.environ.get("USAR_MOCK") == "1"
 
alojamientos_bp = Blueprint("alojamientos", __name__)
 
 
def hoteles_de_ejemplo(lat_venue, lng_venue):
    """
    Hoteles REALES de Londres (datos de hotels-api.com) para demo estable.
    +
    Hoteles falsos en el MISMO formato que devuelve hotels-api.com
    Así pasan por el mismo cálculo de distancia y el mismo filtro de radio que los reales aunque no sean Londres
    """
    lat = float(lat_venue)
    lng = float(lng_venue)
    
    return [
        {
            "id": "real-1", "name": "Sofitel London St James", "city": "London",
            "rating": 5, "lat": 51.50749, "lng": -0.132743
        },
        {
            "id": "real-2", "name": "The Hari", "city": "London",
            "rating": 5, "lat": 51.497279, "lng": -0.155995
        },
        {
            "id": "real-3", "name": "Shangri La Hotel at The Shard", "city": "London",
            "rating": 5, "lat": 51.50436, "lng": -0.087244
        },
        {
            "id": "real-4", "name": "Holiday Inn Express Hammersmith", "city": "London",
            "rating": 3, "lat": 51.492622, "lng": -0.231488
        },
        {
            "id": "real-5", "name": "New Linden Hotel", "city": "London",
            "rating": 4, "lat": 51.513499, "lng": -0.193485
        },

        {"id": "ejemplo-1", "name": "Hotel Ejemplo 1", "lat": lat + 0.005, "lng": lng + 0.005},
        {"id": "ejemplo-2", "name": "Hotel Ejemplo 2", "lat": lat + 0.015, "lng": lng + 0.015},
        {"id": "ejemplo-3", "name": "Hotel Ejemplo 3", "lat": lat + 0.030, "lng": lng + 0.030},
        {"id": "ejemplo-4", "name": "Hotel Ejemplo 4", "lat": lat + 0.050, "lng": lng + 0.060},
        {"id": "ejemplo-5", "name": "Hotel Ejemplo 5", "lat": lat + 0.050, "lng": lng + 0.100},
        {"id": "ejemplo-6", "name": "Hotel Ejemplo 6", "lat": lat + 0.140, "lng": lng + 0.150},
    ]


alojamientos_bp = Blueprint("alojamientos", __name__)

@alojamientos_bp.route("/api/alojamientos")
def buscar_alojamientos():
    ciudad = request.args.get("ciudad")
    lat_venue = request.args.get("lat")
    lng_venue = request.args.get("lng")
    radio_km = float(request.args.get("radio_km", 5))
 
    if not ciudad or not lat_venue or not lng_venue:
        abort(400, description="Faltan ciudad, lat o lng del recinto")
 
    hoteles_crudos = []
    if not USAR_MOCK:
        try:
            # Pedimoshasta el máximo de hoteles del plan gratuito, para tener margen suficiente 
            # al filtrar luego por distancia real al venue.
            respuesta = requests.get(
                "https://api.hotels-api.com/v1/hotels/search",
                params={"city": ciudad, "limit": 20},
                headers={"X-API-KEY": HOTELS_API_KEY},
                timeout=10,
            )
            if respuesta.status_code == 200:
                hoteles_crudos = respuesta.json().get("data", [])
        except requests.RequestException:
            pass

    if USAR_MOCK or len(hoteles_crudos) == 0:
        hoteles_crudos = hoteles_de_ejemplo(float(lat_venue), float(lng_venue))
        simulado = True
    else:
        simulado = False
        
 
    alojamientos = []
    for hotel in hoteles_crudos:
        if hotel.get("lat") is None or hotel.get("lng") is None:
            continue
        distancia = calcular_distancia_km(
            lat_venue, lng_venue, hotel.get("lat"), hotel.get("lng")
        )
        alojamientos.append({
            "id": hotel.get("id"),
            "nombre": hotel.get("name"),
            "lat": hotel.get("lat"),
            "lng": hotel.get("lng"),
            "distancia_km": round(distancia, 2),
            "simulado": simulado,
        })
 
    # Los más cercanos al recinto primero
    alojamientos.sort(key=lambda a: a["distancia_km"])

    return jsonify(alojamientos)