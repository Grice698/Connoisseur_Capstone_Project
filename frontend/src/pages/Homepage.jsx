import { useNavigate, } from "react-router-dom";

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from "react";
import imagenHero from "../assets/felipe-portella-h6gTtqBZUxc-unsplash.jpg";

import "../styles/Homepage.css";
import "../styles/Iconos.css";
import "../styles/Botones.css"

function Homepage() {

    const navigate = useNavigate();
    const imgRef = useRef(null)

    useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const onScroll = () => {
    const subida = Math.min(window.scrollY * 0.1, 50)
    imgRef.current.style.transform = `translateY(-${subida}px)`
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll) // limpieza al salir de la página
}, [])

  return (
    <>
    <main className="homepage" >

        <section className="hero-content">

            <h1>Bienvenido a Connoisseur</h1>

            <p>
                Encuentra conciertos, festivales y descubre alojamientos cerca del
                evento en una sola búsqueda.
            </p>

            <button className="btn start-search-button" onClick={() => navigate("/buscar")}>
                <FontAwesomeIcon icon={faSearch} /> Empezar a buscar
            </button>
        </section>

        <div className="hero-image-container">
            <img ref={imgRef} className="hero-image" src={imagenHero} alt="Concierto" />

        </div>
        
    </main>

    </>

  );
}

export default Homepage;