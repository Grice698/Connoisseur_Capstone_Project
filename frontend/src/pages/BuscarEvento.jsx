import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getConciertos, getAlojamientos, addFavorito } from "../utiles/api";
import TarjetaEvento from "../components/TarjetaEvento";
import TarjetaAlojamiento from "../components/TarjetaAlojamiento";
import Modal from "../components/Modal";
import "../styles/BuscarEvento.css";
import "../styles/Botones.css";
import "../styles/Tarjetas.css";

const RADIOS = [2, 5, 10]

function BuscarEvento() {
  // --- Lo que escribe el usuario ---
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [ciudad, setCiudad] = useState("")
  

  // --- Resultados ---
  const [eventos, setEventos] = useState(null)
  const [eventoElegido, setEventoElegido] = useState(null)
  const [alojamientos, setAlojamientos] = useState([])
  const [alojamientoElegido, setAlojamientoElegido] = useState(null)
  const [radio, setRadio] = useState(5)

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

//--FAVORITOS-- Modal de "guardar en favoritos"
  const [mostrarModal, setMostrarModal] = useState(false)

  const haySesion = Boolean(localStorage.getItem("connoisseur_token"))

  const [offset, setOffset] = useState(0)
  const [hayMasResultados, sethayMasResultados] = useState(true)

  const handleBuscarEventos = async (e) => {
    e.preventDefault()
    
    if (!keyword && !ciudad) {
      setError("Por favor, introduce un artista o ciudad para buscar.")
      return
    }

    setCargando(true)
    setError("")
    setEventos(null)
    setEventoElegido(null)
    setAlojamientos([])
    setOffset(0)
    sethayMasResultados(true)

    try {
      const response = await getConciertos(keyword, ciudad, 0)
      setEventos(response.data)
    } catch {
      setError("No se pudieron cargar los eventos. Inténtalo de nuevo.")
    } finally {
      setCargando(false)
    }
    
  }
  // Loader para cargar mas eventos
  const cargarMasEventos = async () => {
    setCargando(true)
    const nuevoOfset = offset + 15
    try {
      const response = await getConciertos(keyword, ciudad, nuevoOfset)
      if (response.data.length === 0) {
        sethayMasResultados(false)
      } else {
        setEventos([...eventos, ...response.data])
        setOffset(nuevoOfset)
        if (response.data.length < 15) sethayMasResultados(false)
      }
    } catch {
      setError("No se pudieron cargar más eventos.")
    } finally {
      setCargando(false)
    }
  }

  // Recibe el evento entero y pide el radio máximo (10) para ver los hoteles cercanos.
  // 2/5/10 km filtran despues en el navegador (antes darle a cada boton gastaba 1 api token)
  const handleBuscarAlojamientos = async (evento) => {
    setCargando(true)
    setError("")
    setAlojamientos([])
    
    try {
      const response = await getAlojamientos(
        evento.ciudad, evento.lat, evento.lng, RADIOS[RADIOS.length - 1]
      )
      setAlojamientos(response.data)
      console.log("Hoteles recibidos:", response.data.length, "Total. Filtrados en UI por radio:", radio) //
    } catch {
      setError("Error al buscar alojamientos.")
    } finally {
      setCargando(false)
    }
  }

  const handleVolver = () => {
    setEventoElegido(null)
    setAlojamientos([])
    setError("")
  }


  const handleVolverAlojamientos = () => {
    setAlojamientoElegido(null) // Solo deseleccionamos el hotel, mantenemos el evento
  }

  const volverALosEventos = () => {
    setAlojamientoElegido(null)
    setEventoElegido(null)
    setAlojamientos([])
    setMostrarModal(false)
  }

  //Al terminar de seleccionar eventos + hoteles se nos muestra un "resumen"
  const handleGuardarPlan = async (destino) => {
    try {
      await addFavorito({
        nombre_evento: eventoElegido.nombre,
        ciudad: eventoElegido.ciudad,
        fecha_evento: eventoElegido.fecha,
        nombre_alojamiento: alojamientoElegido.nombre,
        distancia_km: alojamientoElegido.distancia_km,
        nota: ""
      });

      setMostrarModal(false);

      if (destino === "favoritos") {
        navigate("/favoritos");

      } else {
        volverALosEventos();
      }
    } catch (err) {
      setMostrarModal(false);
      if ([401, 422].includes(err.response?.status)) {
        localStorage.removeItem("connoisseur_token");
        navigate("/login")
        return
      }
      setError("No se pudo guardar el favorito")
    }
  }

  const handleEmpezarDeNuevo = () => {
    volverALosEventos()
    setEventos(null)
  }
  // LOGICA DE 3 VISTAS PARA TODO EL FLUJO DE BUSQUEDAS: Formulario de busquedas y lista de eventos, lista de alojamientos y resumen del plan
  // ===== VISTA 3: Resumen del plan seleccionado (Usuario sin sesión o antes de guardar) =====
  if (eventoElegido && alojamientoElegido) {
    const minutosAndando = Math.round((alojamientoElegido.distancia_km / 5) * 60);

    return (
      <main className="buscar-detalles-plan">
        <button onClick={handleVolverAlojamientos} className="btn-volver">
          ← Volver a la lista de alojamientos
        </button>

        <div className="resumen-eventos-musicales">
          <h2>Resumen de tu plan</h2>
          
          <div className="detalle-seccion">
            <h3>🎵 {eventoElegido.nombre}</h3>
            <p>{eventoElegido.fecha} | {eventoElegido.recinto}, {eventoElegido.ciudad}</p>
          </div>

          <div className="detalle-seccion">
            <h3>🏨 {alojamientoElegido.nombre}</h3>
            <p>
              <strong>Distancia:</strong> {alojamientoElegido.distancia_km} km del recinto.
            </p>
            <p>
              <strong>Tiempo estimado andando:</strong> ~{minutosAndando} minutos (a ritmo medio).
            </p>
          </div>

          <div className="confirmacion-acciones">
            {haySesion ? (
              <>
                <p>¿Te encaja esta combinación?</p>
                <button className="btn-aceptar-detalles" onClick={() => setMostrarModal(true)}>Guardar en favoritos</button>
              </>
            ) : (
              <>
                <p>Inicia sesión para guardar esta combinación en tus favoritos.</p>
                <button className="btn-aceptar-detalles" onClick={() => navigate("/login")}>Iniciar sesión</button>
              </>
            )}
            
            
            <button className="btn-aceptar-detalles" onClick={() => navigate('/')} >
              Aceptar y volver al inicio
            </button>
          </div>
        </div>
        
        <Modal 
          abierto={mostrarModal} 
          titulo="¿Guardar esta combinación?" 
          onCerrar={() => setMostrarModal(false)}
        >
          <p>Se añadirá a tu lista de favoritos.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn" 
            onClick={async () => {
              await handleGuardarPlan("favoritos");
            }}>
              Guardar y ver mis favoritos
            </button>

            <button className="btn"
            onClick={async () => {
              handleGuardarPlan("seguir");
            }}
            >
              Guardar y seguir buscando
            </button>

            <button className="btn" 
              onClick={() => {
                  setMostrarModal(false);
                  handleEmpezarDeNuevo();
                }}
              >
              No guardar y empezar de nuevo
            </button>   
          </div>
        </Modal>
      </main>
    )
  }

  // ===== VISTA 2: alojamientos del evento elegido =====
  if (eventoElegido) {
    const visibles = alojamientos.filter((a) => a.distancia_km <= radio)
    
    return (
      <main className="buscar">
        <button onClick={handleVolver} className="btn-volver">
          ← Volver a: {eventoElegido.nombre}
        </button>

        <h2>Alojamientos cerca de {eventoElegido.recinto}</h2>

        <div className="botones-radio">
          {RADIOS.map((km) => (
            <button
              key={km}
              onClick={() => setRadio(km)}
              className={`btn-radio ${km === radio ? "activo" : ""}`}
            >
              {km} km
            </button>
          ))}
        </div>

        {error && <p className="error" style={{ color: "red" }}>{error}</p>}
        {cargando && <p>Cargando alojamientos...</p>}

        {!cargando && !error && visibles.length === 0 && (
          <p>No hay alojamientos a {radio} km. Prueba con otra distancia</p>
        )}

        {alojamientos.some((a) => a.simulado) && (
          <p>Datos de ejemplo: la API de alojamientos no ha devuelto resultados.</p>
        )}

        <div className="grid-alojamientos">
          {visibles.map((a) => (
            <TarjetaAlojamiento 
              key={a.id} 
              alojamiento={a} 
              onSelect={setAlojamientoElegido}
            />
          ))}
        </div>
        
      </main>
    )
  }

  // ===== VISTA 1: buscador y lista de eventos =====
  return (
    <main className="buscar">
      <h1>Buscar eventos y alojamientos</h1>

      <form onSubmit={handleBuscarEventos} className="form-busqueda">
        <input
          type="text"
          placeholder="Artista o evento (ej. Imagine Dragons)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Ciudad (ej. Madrid)"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" disabled={cargando} className="btn-buscar">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px' }} />
          {cargando ? "Buscando..." : "Buscar"} 
        </button>
      </form>

      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      {cargando && <p>Buscando eventos...</p>}

      {eventos && eventos.length === 0 && !cargando && (
        <p>No se encontraron eventos. Prueba con otra búsqueda.</p>
      )}

      <div className="grid-eventos">
        {eventos && eventos.map((evento) => (
          <TarjetaEvento 
            key={evento.id} 
            evento={evento} 
            onSelect={(evt) => {
              setEventoElegido(evt)
              handleBuscarAlojamientos(evt)
            }} 
          />
        ))}
      </div>

      {hayMasResultados && eventos && eventos.length >= 15 && (
        <div className="botones-radio">
          <button
            onClick={cargarMasEventos}
            disabled={cargando}
            className="btn-cargar-mas-eventos"
          >
            {cargando ? "Cargando..." : "Cargar 15 eventos más"}  
          </button>  
        </div>
      )}
    </main>
  )
}

export default BuscarEvento