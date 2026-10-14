import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utiles/api";

import "../styles/Forms.css";
import "../styles/Botones.css";

const LoginForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    try {
      const response = await loginUser(email, password)
      localStorage.setItem("connoisseur_token", response.data.token)
      
      setSuccess("¡Sesión iniciada! Redirigiendo...")

      setTimeout(() => {
        navigate("/")
      }, 1500)

    } catch (err) {
      setError("Email o contraseña incorrectos")
    }
  }

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>

      {success && <div className="auth-message success">{success}</div>}
      {error && <div className="auth-message error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-login">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-login">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-submit">Iniciar sesión</button>
      </form>
    </div>
  )
}

export default LoginForm