from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Favorito

favoritos_bp = Blueprint("favoritos", __name__)

#@app.route se convierte en @favoritos_bp.route al aplicar las blueprints

#CRUD de favoritos

# === CONSULTAR FAVORITOS === 
@favoritos_bp.route("/api/favoritos", methods=["GET"]) 
@jwt_required()
def listar_favoritos():
    usuario_id = get_jwt_identity()
    favoritos = Favorito.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([f.to_dict() for f in favoritos])
 
# === CREAR FAVORITOS ===  
@favoritos_bp.route("/api/favoritos", methods=["POST"])
@jwt_required()
def crear_favorito():
    usuario_id = get_jwt_identity()
    datos = request.get_json()
    nuevo = Favorito(
        usuario_id=usuario_id,
        nombre_evento=datos.get("nombre_evento"),
        ciudad=datos.get("ciudad"),
        fecha_evento=datos.get("fecha_evento"),
        nombre_alojamiento=datos.get("nombre_alojamiento"),
        distancia_km=datos.get("distancia_km"),
        nota=datos.get("nota"),
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

# === ACTUALIZAR/EDITAR FAVORITOS === 
@favoritos_bp.route("/api/favoritos/<int:favorito_id>", methods=["PUT"])
@jwt_required()
def actualizar_favorito(favorito_id):
    usuario_id = get_jwt_identity()
    favorito = Favorito.query.get_or_404(favorito_id)

# Comprobación de que ese favorito sea del usuario
    if str(favorito.usuario_id) != usuario_id:
        abort(403, description="Este favorito no pertenece a tu usuario")
    
    datos = request.get_json()
    favorito.nota = datos.get("nota", favorito.nota)
    db.session.commit()
    return jsonify(favorito.to_dict())
 
# === ELIMINAR FAVORITOS === 
@favoritos_bp.route("/api/favoritos/<int:favorito_id>", methods=["DELETE"])
@jwt_required()
def borrar_favorito(favorito_id):
    usuario_id = get_jwt_identity()
    favorito = Favorito.query.get_or_404(favorito_id)

    if str(favorito.usuario_id) != usuario_id:
        abort(403, description="Este favorito no pertenece a tu usuario")
    db.session.delete(favorito)
    db.session.commit()
    return "", 204