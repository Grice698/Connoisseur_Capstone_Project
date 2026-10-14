import { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import "../styles/MenuHamburguesa.css";
import "../styles/Botones.css";

function MenuHamburguesa() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Comprobamos si existe el token en cada renderizado del menú
    const haySesion = Boolean(localStorage.getItem("connoisseur_token"));

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    return (
        <>
            <button className="menu-btn" onClick={toggleMenu}>
                ☰
            </button>

            {menuAbierto && (
                <div className="menu-hamburguesa-overlay">
                    <div className="menu-hamburguesa-content">
                        <button className="close-button" onClick={toggleMenu}>✕</button>
                        <h2>Menú</h2>
                        <ul>
                            <li>
                                <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/buscar" onClick={() => setMenuAbierto(false)}>Buscar eventos + alojamientos</Link>
                            </li>

                            {haySesion && (
                                <li>
                                    <Link to="/favoritos" onClick={toggleMenu}>Mis favoritos</Link>
                                </li>
                            )}

                            <li>
                                <Link to="/sobre" onClick={() => setMenuAbierto(false)}>Sobre Connoisseur</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default MenuHamburguesa;