# Capstone Full Stack: Connoisseur

**Connoisseur** es una aplicación que busca conciertos y festivales y, sobre el evento elegido, muestra alojamientos cercanos filtrando tres distancias (2, 5, 10km). Los usuarios registrados pueden guardar combinaciones de eventos y alojamientos en una lista de favoritos para consultarlas siempre que deseen. Ahora mismo

---

## Características principales

- **Cálculo de distancia en tiempo real entre el recinto y los hoteles usando la **Fórmula de Haversine**, con filtros interactivos de 2km, 5km y 10km.**

- **Los usuarios pueden guardar planes, añadir notas personales y eliminarlos.**

- **Flujo de 3 Vistas Condicionales para las búsquedas de hoteles + eventos, filtrado por radios para los alojamientos y un resumen de lo buscado**

- ** **

---

## Stack utilizado

### **Frontend**
- React + Vite
- Axios
- FontAwesome
- react-router-dom
- Node 24.21.0
- CSS / HTML

### **Backend**
- Python 3.14
- Flask-SQLAlchemy 3.1
- Flask-CORS
- SQLite
- flask-jwt-extended
- Gunicorn (para despliegue)
- Render (hosting backend)
- Vercel (hosting frontend)
- requests
- python-dotenv
- Entorno .venv

### **APIs externas**
- Ticketmaster Discovery
- hotels-api.com 
>
    ATENCION: Ahora mismo la aplicacion cuenta con alrededor de 80 solicitudes para hotels-api.com (USAR_MOCK=0) para ofrecer la experiencia completa. No obstante, durante el desarrollo se implementó y probó un modo simulado, una variable de entorno (USAR_MOCK=1) como medida que limitaba la petición de solicitudes innecesarias. En este "mock" se utilizaban datos de ejemplo con coordenadas reales de Londres para garantizar estabilidad, y además unos datos falsos que se ajustaban a todos los radios disponibles

---

## Problemas encontrados y cómo se resolvieron

**El plan gratuito de hotels-api.com nos limita a 100 consultas, no incluye búsquedas por coordenada y además devuelve máximo 20 hoteles por petición. Por ello se han intentado encontrar varias soluciones a estas limitaciones:**

- La distancia se filtra en Python mediante la fórmula de Haversine, que nos ayuda a calcular la distancia en línea recta entre un evento y un hotel dadas sus coordenadas de longitud y latitud.

- Modo mock: USAR_MOCK=1 en el .env fuerza hoteles de ejemplo, algo que durante el desarrollo ha sido crucial, ya que anteriormente probar los botones para filtrar el radio consumía una solicitud de la API. Ahora mismo hay 6 hoteles de ejemplo más 5 hoteles reales de Londres sacados de una respuesta real. 

---

**El despliegue obligaba a hacer una migración de base de datos**