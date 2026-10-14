import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from extensions import db, jwt
from routes.eventos import eventos_bp
from routes.alojamientos import alojamientos_bp
from routes.auth import auth_bp
from routes.favoritos import favoritos_bp
from routes.perfil import perfil_bp
from models import Usuario

load_dotenv()
app = Flask(__name__)

CORS(app)
#para frontend en Vercel

database_url = os.environ.get("DATABASE_URL")

if database_url and database_url.startswith("postgres://"):
   database_url = database_url.replace("postgres://", "postgresql://", 1)
   app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
   basedir = os.path.abspath(os.path.dirname(__file__))
   ruta_db = os.path.join(basedir, "connoisseur.db")
   app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + ruta_db.replace("\\", "/")
 
# SQLAlchemy necesita barras "/" en la cadena de conexión, aunque
# Windows use "\" en sus rutas — por eso el replace.

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración de JWT (clave secreta para firmar los tokens)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

# Conectamos las extensiones
db.init_app(app)
jwt.init_app(app)
 
# Registramos cada blueprint
app.register_blueprint(eventos_bp)
app.register_blueprint(alojamientos_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(favoritos_bp)
app.register_blueprint(perfil_bp)


#endpoint primero ever.
@app.route("/")
def home():
   return {"mensaje": "Connoisseur funcionando..."}

#creamos tablas y usuario con demo    
with app.app_context():
    db.create_all()

    if not Usuario.query.first():
       demo= Usuario(email="Usuariodemo@connoisseur.com", username="demoUser")
       demo.set_password("Demo1234!")
       db.session.add(demo)
       db.session.commit()


if __name__ == "__main__":
  app.run(debug=True, port=5000)