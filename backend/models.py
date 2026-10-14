from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


#tabla Usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
# GESTIONAR CONTRASEÑAS
    def set_password(self, password_en_texto_plano):
        self.password_hash = generate_password_hash(password_en_texto_plano)
 
    def comprobar_password(self, password_en_texto_plano):
        return check_password_hash(self.password_hash, password_en_texto_plano)

    # Relación: un usuario puede tener muchos favoritos, al borrar una cuenta sus favoritos se borran tambien
    favoritos = db.relationship('Favorito', backref='usuario', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username
        }


#tabla favorito
class Favorito(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False, index=True)
    nombre_evento = db.Column(db.String(200), nullable=False)
    ciudad = db.Column(db.String(100))
    fecha_evento = db.Column(db.String(50))
    nombre_alojamiento = db.Column(db.String(200))
    distancia_km = db.Column(db.Float, nullable=True)
    nota = db.Column(db.String(500))


    def to_dict(self):
        return {
            "id": self.id,
            "nombre_evento": self.nombre_evento,
            "ciudad": self.ciudad,
            "fecha_evento": self.fecha_evento,
            "nombre_alojamiento": self.nombre_alojamiento,
            "distancia_km": self.distancia_km,
            "nota": self.nota,
        }