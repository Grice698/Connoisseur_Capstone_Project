import "../styles/Tarjetas.css"

function TarjetaEvento({ evento, onSelect }) {
    return (
        <div className="tarjeta" onClick={() => onSelect(evento)}>
            <h3>{evento.nombre}</h3>
            <p><strong>Fecha:</strong> {evento.fecha}</p>
            <p><strong>Recinto:</strong> {evento.recinto}</p>
            <p><strong>Ciudad:</strong> {evento.ciudad}</p>
        </div>
    );
}

export default TarjetaEvento;