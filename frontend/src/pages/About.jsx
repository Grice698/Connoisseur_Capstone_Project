import { useNavigate } from "react-router-dom";
import "../styles/About.css";
import "../styles/Botones.css"

function About() {
  const navigate = useNavigate()

  return(
    <main className="about-page">
      <div className="about-container">
        <button className="btn-volver" onClick={() => navigate("/")}>
          ← Volver al inicio
        </button>

        <h1>Sobre Connoisseur</h1>

        <section className="about-section">
          <h2>¿Qué es Connoisseur?</h2>
          <p>
            Connoisseur nace de una necesidad bastante común entre viajeros y amantes de la música.
            ¿Una vez encontrado mi evento musical, dónde puedo dormir? Viajar para disfrutar de un concierto
            no debería ser motivo de estrés. Gracias a Connoisseur serás capaz de conectar tus conciertos y 
            festivales favoritos con alojamientos cercanos, <strong>todo en una misma búsqueda</strong>, calculando distancias y tiempos 
            a pie para que solo te preocupes de disfrutar del evento.
          </p>
        </section>

        <section className="about-section">
          <h2>Tecnología</h2>
          <p>Este proyecto Capstone Full Stack ha sido desarrollado con:</p>
          <ul className="tecnologias-lista">
            <li><strong>Frontend:</strong> React, Vite, React Router y Axios.</li>
            <li><strong>Backend:</strong> Python, Flask, SQLAlchemy y SQLite.</li>
            <li><strong>APIs</strong> Ticketmaster Discovery API y Hotels-API.</li>
          </ul>
        </section>

      </div>
    </main>
  )
}

export default About;