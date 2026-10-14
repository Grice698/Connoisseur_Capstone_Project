import { useNavigate } from "react-router-dom";
import MenuHamburguesa from "./MenuHamburguesa";
import "../styles/Header.css";
import "../styles/Botones.css"

function Header() {
    const navigate = useNavigate();

    // Comprobamos si hay token guardado
    const token = localStorage.getItem("connoisseur_token");

    const handleLogout = () => {
        localStorage.removeItem("connoisseur_token");
        navigate("/"); 
    };

    return (
        <header className="header">
            <MenuHamburguesa />

            <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                CONNOISSEUR
            </div>

            <div className="auth-buttons">
                {token ? (
                    <>
                        <button className="btn" onClick={() => navigate("/perfil")}>Perfil</button>
                        <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
                    
                    </>
                ) : (
                    <>
                        <button className="btn" onClick={() => navigate("/registro")}>Registro</button>
                        <button className="btn" onClick={() => navigate("/login")}>Login</button>
                    </>

                )}
                
            </div>
        </header>
    )
}

export default Header;