import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Dashboard from "./pages/Dashboard/dashboard";
import Clientes from "./pages/Clientes/clientes";
import Agenda from "./pages/Agenda/agenda";
import AgendaDia from "./pages/AgendaDia/agendadia";
import Equipe from "./pages/Equipe/equipe";
import Perfil from "./pages/Perfil/perfil";

import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda-dia" element={<AgendaDia />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/perfil" element={<Perfil />} />
      </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;