// En local usa localhost; al desplegar, la URL real viene de VITE_API_URL
// PONER import.meta.env.VITE_API_URL
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||"http://localhost:5000",
}); 

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("connoisseur_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function loginUser(email, password) {
  return api.post("/api/login", { email, password })
}

export function registerUser(email, password, username) {
  return api.post("/api/registro", { email, password, username })
}

export const getPerfil = () => api.get("/api/perfil")
 
export const updateUsername = (username) => api.put("/api/perfil", { username })
 
// Misma ruta que el perfil, con el método DELETE (en vez de /api/usuario)
export const deleteAccount = () => api.delete("/api/perfil")

export function getConciertos(keyword, ciudad, offset = 0) {
  return api.get("/api/conciertos",{
    params: { keyword,ciudad, offset }
  });
}

export function getAlojamientos(ciudad, lat, lng, radio_km) {
  return api.get("/api/alojamientos", {
    params: { ciudad, lat, lng, radio_km }
  });
}

export const getFavoritos = () => api.get("/api/favoritos")

export const addFavorito = (favorito) => api.post("/api/favoritos", favorito)

export const updateNota = (id, nota) => api.put(`/api/favoritos/${id}`, { nota })

export const deleteFavorito = (id) => api.delete(`/api/favoritos/${id}`)