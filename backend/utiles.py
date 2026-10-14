import math

def calcular_distancia_km(lat1, lon1, lat2, lon2):
    """
    Distancia en línea recta (km) entre dos puntos del planeta,
    dados por su latitud y longitud. Fórmula de Haversine.
    """
    lat1 = float(lat1)
    lon1 = float(lon1)
    lat2 = float(lat2)
    lon2 = float(lon2)
 
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
 
    diferencia_lat = lat2_rad - lat1_rad
    diferencia_lon = lon2_rad - lon1_rad
 
    a = (math.sin(diferencia_lat / 2) ** 2
         + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(diferencia_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
 
    radio_tierra_km = 6371
    return radio_tierra_km * c