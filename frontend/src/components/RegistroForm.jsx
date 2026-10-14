import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../utiles/api"

import "../styles/Forms.css"
import "../styles/Botones.css"

const RegistroForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    try {
      const response = await registerUser(email, password, username)
      
      localStorage.setItem("connoisseur_token", response.data.token)

    //mensaje de éxito
      setSuccess("¡Usuario registrado correctamente! Redirigiendo...")

      // Esperamos 1.5 segundos y mandamos a la Homepage ("/")
      setTimeout(() => {
        navigate("/")
      }, 1500)

    } catch (err) {
      setError("No se pudo completar el registro")
    }
  }

  return (
    <div className="auth-container">
      <h2>Crear cuenta</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}


      <form onSubmit={handleSubmit}>
        <div className="form-registro">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-registro">
          <label>Nombre de usuario (opcional):</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-registro">
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-submit">Registrarse</button>
      </form>
    </div>
  )
}

export default RegistroForm;