from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db

from models import Usuario

perfil_bp = Blueprint("perfil", __name__)

@perfil_bp.route("/api/perfil", methods=["GET"])
@jwt_required()
def ver_perfil():
    # El id sale del token verificado, nunca de lo que mande el frontend
    usuario = Usuario.query.get_or_404(int(get_jwt_identity()))
    return jsonify(usuario.to_dict())
 
 
@perfil_bp.route("/api/perfil", methods=["PUT"])
@jwt_required()
def editar_perfil():
    usuario = Usuario.query.get_or_404(int(get_jwt_identity()))
    datos = request.get_json()
    username = datos.get("username") or None 
 
    if username and Usuario.query.filter(
        Usuario.username == username, Usuario.id != usuario.id
    ).first():
        abort(409, description="Ese nombre de usuario ya está en uso")
 
    usuario.username = username
    db.session.commit()
    return jsonify(usuario.to_dict())
 
 
@perfil_bp.route("/api/perfil", methods=["DELETE"])
@jwt_required()
def eliminar_cuenta():
    usuario = Usuario.query.get_or_404(int(get_jwt_identity()))

    db.session.delete(usuario)
    db.session.commit()
    return "", 204