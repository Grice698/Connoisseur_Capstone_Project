from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

from extensions import db
from models import Usuario

auth_bp = Blueprint("auth", __name__)


# === REGISTRO ===
@auth_bp.route("/api/registro", methods=["POST"])
def registro():
    datos = request.get_json()
    email = datos.get("email")
    password = datos.get("password")
    username = datos.get("username") or None  # Opcional desde el frontend

    if not email or not password:
        abort(400, description= "Faltan email o contraseña")

    if Usuario.query.filter_by(email=email).first():
        abort(409, description="Ese correo ya existe")

    if username and Usuario.query.filter_by(username=username).first():
        abort(409, description="Ese nombre de usuario ya está en uso")

    # Cifrar la contraseña antes de guardarla con Werkzeug
    password_cifrada = generate_password_hash(password)

    nuevo_usuario = Usuario(email=email, username=username, password_hash=password_cifrada)
    db.session.add(nuevo_usuario)
    db.session.commit()

    # Tras registrarse, lo dejamos ya logueado y le devolvemos su token
    token = create_access_token(identity=str(nuevo_usuario.id))
    return jsonify({"token": token, "username": nuevo_usuario.username}), 201


# === LOGIN ===
@auth_bp.route("/api/login", methods=["POST"])
def login():
    datos = request.get_json()
    email = datos.get("email")
    password = datos.get("password")

    if not email or not password:
        abort(400, description="Faltan email o contraseña")

    usuario = Usuario.query.filter_by(email=email).first()

    # Verificar si el usuario existe + contraseña coincide con el hash
    if not usuario or not usuario.comprobar_password(password):
        abort(401, description="Email o contraseña incorrectos")

    token = create_access_token(identity=str(usuario.id))
    return jsonify({"token": token, "username": usuario.username})
