import "../styles/Tarjetas.css"

function TarjetaAlojamiento({ alojamiento, onSelect }) {
  return (
    <div className="tarjeta" onClick={() => onSelect(alojamiento)}>
      <h3>{alojamiento.nombre}</h3>
      <p><strong>Distancia al recinto:</strong> {alojamiento.distancia_km} km</p>
      {/*  añadir más campos aquí luego si la API de hoteles los devuelve mal */}
    </div>
  );
}

export default TarjetaAlojamiento;