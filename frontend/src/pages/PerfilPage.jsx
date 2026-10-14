import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfil, updateUsername, deleteAccount } from "../utiles/api";

import Modal from "../components/Modal";
import "../styles/PerfilPage.css"
import "../styles/Botones.css";
import "../styles/Iconos.css";

function Perfil() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: "", username: "" });
    const [nuevoUsername, setNuevoUsername] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    // Al cargar la página, traemos los datos del usuario
    // Caso A: no hay token(no esta registrado)
    useEffect(() => {
        if (!localStorage.getItem("connoisseur_token")) {
            navigate("/registro") //le mandamos a registrarse
            return
        }
        
        const fetchUserData = async () => {
            try {
                const response = await getPerfil();
                setUser(response.data);
                setNuevoUsername(response.data.username || "");
            } catch (err) {

            // Caso B: hay token pero el backend no lo acepta, ha caducado a los 7 dias
            
            if ([401, 404, 422].includes(err.response?.status)) {
                localStorage.removeItem("connoisseur_token");
                navigate("/login"); // nos redirige a login
                return;
            }
            setError("No se pudo cargar la información del perfil.");
        }
    };

    fetchUserData();
}, [navigate]);

    // Para manejar el cambio de username
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        try {
            await updateUsername(nuevoUsername);
            setMensaje("¡Nombre de usuario actualizado con éxito!");
            setUser({ ...user, username: nuevoUsername });
        } catch (err) {
            setError("Error al actualizar el nombre de usuario.");
        }
    };

    // Manejar la eliminación de la cuenta
    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            localStorage.removeItem("connoisseur_token");
            navigate("/");
        } catch (err) {
            setMostrarModal(false);
            setError("No se pudo eliminar la cuenta.");
        }
    };
     

    return (
        <div className="perfil-container">
            <div className="perfil-encabezado">
                <h1>Mi Perfil</h1>
            </div>

            {error && <div className="mensaje-error">{error}</div>}
            {mensaje && <div className="mensaje-exito">{mensaje}</div>}

            <div className="perfil-info">
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <form onSubmit={handleUpdate} className="form-perfil">
                <div className="form-perfil-campos">
                    <label>Nombre de usuario:</label><br />
                    <input
                        type="text"
                        value={nuevoUsername}
                        onChange={(e) => setNuevoUsername(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-principal">
                    Actualizar perfil
                </button>
            </form>

            <div className="zona-peligro">
                <h3>Zona de peligro</h3>
                <p>Si eliminas tu cuenta, se borrarán todos tus datos y planes favoritos guardados.</p>
                <button className="btn btn-peligro" 
                    onClick={() => setMostrarModal(true)} 
                >
                    Eliminar mi cuenta
                </button>
            </div>

            <Modal
                abierto={mostrarModal}
                titulo="¿Eliminar tu cuenta de Connoisseur?"
                onCerrar={() => setMostrarModal(false)}
            >
                <p>Esta acción no se puede deshacer y borrará tus favoritos.</p>
                <button className="btn btn-secundario" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button className="btn btn-peligro" onClick={handleDeleteAccount}>Sí, eliminar</button>
            </Modal>
        </div>
    );
}

export default Perfil;