import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFavoritos, deleteFavorito, updateNota } from "../utiles/api";
import TarjetaFavorito from "../components/TarjetaFavorito";
import Modal from "../components/Modal";
import "../styles/Favoritos.css";

function Favoritos() {
    const navigate = useNavigate()
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")

    const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
    const [favoritoEditando, setFavoritoEditando] = useState(null)
    const [nuevaNota, setNuevaNota] = useState("")

    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
    const [favoritoAEliminar, setFavoritoAEliminar] = useState(null)

    useEffect(() => {
        cargarFavoritos()
    }, []);

    const cargarFavoritos = async () => {
        setCargando(true)
        try {
            const response = await getFavoritos()
            setFavoritos(response.data)
        } catch {
            setError("No se pudieron cargar tus favoritos.")
        } finally {
            setCargando(false)
        }
    }
    
    const handleEliminar = (favorito) => {
        setFavoritoAEliminar(favorito)
        setModalEliminarAbierto(true)
    }
    
    const confirmarEliminacion = async () => {
        if (!favoritoAEliminar) return
        try {
            await deleteFavorito(favoritoAEliminar.id)
            setFavoritos(favoritos.filter(f => f.id !== favoritoAEliminar.id))
            setModalEliminarAbierto(false)
            setFavoritoAEliminar(null)
        } catch {
            alert("Error al eliminar el favorito.")
        }
    }
    

    const abrirModalEdicion = (favorito) => {
    setFavoritoEditando(favorito)
    setNuevaNota(favorito.nota || "")
    setModalEditarAbierto(true)
  }

  const handleGuardarNota = async () => {
    try {
        await updateNota(favoritoEditando.id, nuevaNota)
        setFavoritos(favoritos.map(f =>
            f.id === favoritoEditando.id ? { ...f, nota: nuevaNota } : f
        ))
        setModalEditarAbierto(false)
        setFavoritoEditando(null)
    } catch {
        alert("Error al guardar la nota.")
    }
  }
  
  if (cargando) return <main className="favoritos-page"><p>Cargando tus planes...</p></main>
  if (error) return <main className="favoritos-page"><p>{error}</p></main>

  return (
    <main className="favoritos-page">
        <div className="favoritos-container">
        <div className="favoritos-header">
            <h1>Mis Planes Guardados</h1>
            <button className="btn-volver" onClick={() => navigate("/")}>← Volver al inicio</button>
        </div>

        {favoritos.length === 0 ? (
            <div className="estado-vacio">
                <p>📭 No tienes planes guardados aún</p>
                <button onClick={() => navigate("/buscar")}>
                    Añade tu primer plan ahora
                </button>
            </div>
        ) : (
        <div className="lista-favoritos">
            {favoritos.map(fav => (
              <TarjetaFavorito 
                    key={fav.id} 
                    favorito={fav} 
                    onEditar={() => abrirModalEdicion(fav)}
                    onEliminar={() => handleEliminar(fav)}
                />
            ))}
          </div>
        )}
      </div>
    
        <Modal
            abierto={modalEditarAbierto}
            titulo="Editar nota del plan"
            onCerrar={() => setModalEditarAbierto(false)}
        >
            <textarea 
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                placeholder="Ej: Parking cercano, con desayuno..."
                className="textarea-nota"
                rows={"4"}
            />
            <div className="modal-favoritos-botones">
                <button className="btn btn-principal" onClick={() => setModalEditarAbierto(false)}> Cancelar</button>
                <button className="btn btn-principal" onClick={handleGuardarNota}> Guardar</button>
            </div>
        </Modal>

        <Modal
            abierto={modalEliminarAbierto}
            titulo="¿Eliminar este plan?"
            onCerrar={() => setModalEliminarAbierto(false)}
        >
            <p>
                {favoritoAEliminar && (
                   <strong>
                        {favoritoAEliminar.nombre_evento} - {favoritoAEliminar.nombre_alojamiento}
                   </strong> 
                )}
            </p>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-favoritos-botones">
                <button className="btn" onClick={() => setModalEliminarAbierto(false)}>Cancelar</button>
                <button className="btn btn-peligro" onClick={confirmarEliminacion}>Sí, eliminar</button>
            </div>
        </Modal>
    </main>
  )
}

export default Favoritos;