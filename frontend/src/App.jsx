import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import BuscarEvento from "./pages/BuscarEvento";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import About from "./pages/About";
import Perfil from "./pages/PerfilPage";
import Favoritos from "./pages/Favoritos";


function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/buscar" element={<BuscarEvento />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/favoritos" element={<Favoritos />} />
    </Routes>
    </>
  );
}

export default App;
