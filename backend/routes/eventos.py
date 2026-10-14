import os
import requests
from flask import Blueprint, abort, request, jsonify
from dotenv import load_dotenv

load_dotenv()
TICKETMASTER_API_KEY = os.environ.get("TICKETMASTER_API_KEY", "")
 
eventos_bp = Blueprint("eventos", __name__)

#endpoint para los conciertos/eventos de solo lectura, puente para APIs

@eventos_bp.route("/api/estado")
def estado():
    """Solo para comprobar que el servidor está vivo."""
    return jsonify({"status": "ok"})


@eventos_bp.route("/api/conciertos")
def buscar_conciertos():
    ciudad = request.args.get("ciudad", "")
    keyword = request.args.get("keyword", "")
    offset = int(request.args.get("offset", 0)) #paginación

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "classificationName": "music",
        "size": 15,
        "page": offset // 15,
    }
    
    if ciudad:
        params["city"] = ciudad
    if keyword:
        params["keyword"] = keyword
 
    respuesta = requests.get(
        "https://app.ticketmaster.com/discovery/v2/events.json",
        params=params,
        timeout=10,
    )
    if respuesta.status_code != 200:
        abort(502, description="Ticketmaster no responde")
 
    datos = respuesta.json()
    eventos_crudos = datos.get("_embedded", {}).get("events", [])
 
    # Solo frontend
    eventos = []
    for e in eventos_crudos:
        venue = e.get("_embedded", {}).get("venues", [{}])[0]
        eventos.append({
            "id": e.get("id"),
            "nombre": e.get("name"),
            "fecha": e.get("dates", {}).get("start", {}).get("localDate"),
            "recinto": venue.get("name"),
            "ciudad": venue.get("city", {}).get("name"),
            "lat": venue.get("location", {}).get("latitude"),
            "lng": venue.get("location", {}).get("longitude"),
        })
 
    return jsonify(eventos)