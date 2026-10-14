import "../styles/Modal.css"

// Recibe si está abierto, un título, qué hacer al cerrar
// el contenido (texto y botones) como "children".
function Modal({ abierto, titulo, onCerrar, children }) {
  if (!abierto) return null

  return (
    // Clic en el fondo oscuro = cerrar
    <div className="modal-overlay" onClick={onCerrar}>
      {/* stopPropagation: un clic DENTRO de la caja no cierra el modal */}
      <div
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal