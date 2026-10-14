import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../styles/Tarjetas.css";
import "../styles/Botones.css";
import "../styles/Iconos.css";

function TarjetaFavorito({ favorito, onEditar, onEliminar }) {
    const distancia = favorito.distancia_km || 0
    const minutosAndando = Math.round((distancia / 5 ) * 60)

    return (
        <div className="favorito-tarjeta">
            <div className="favorito-info">
                <h3>🎵 {favorito.nombre_evento}</h3>
                <p className="subtitulo">{favorito.fecha_evento} | {favorito.ciudad}</p>
            
                <div className="favorito-detalle">
                    <strong>🏨 {favorito.nombre_alojamiento}</strong>
                    <p className="distancia-visual">🚶 {minutosAndando} min ({distancia} km)</p>
                </div>
                
                {favorito.nota && (
                    <div className="favorito-nota">
                        <p><strong>📝 Nota:</strong> {favorito.nota}</p>
                    </div>
                )}
            </div>

            <div className="favorito-acciones"> 
                <button className="btn-editar-nota" onClick={onEditar} title="Editar nota">
                    <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
 
                <button className="btn-peligro" onClick={onEliminar} title="Eliminar plan">
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                </button>
            </div>
        </div>
    )
}

export default TarjetaFavorito;