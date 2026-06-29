import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login.jsx";
import Dashboard from "./pages/Dashboard/dashboard";
import Clientes from "./pages/Clientes/clientes";
import Agenda from "./pages/Agenda/agenda";
import AgendaDia from "./pages/AgendaDia/agendadia";
import Equipe from "./pages/Equipe/equipe";
import PrivateAdmin from "./routes/PrivateAdmin";
import Admin from "./pages/Admin/admin";
import Indique from "./pages/Indique/indique.jsx";
import Sidebar from "./components/sidebar.jsx";
import Convite from "./pages/Convite";
import Referral from "./pages/Referral";
import Landing from "./pages/Landing";


import MainLayout from "./layouts/MainLayout";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
    path="/i/:code"
    element={<Referral />}
/>
<Route path="/r/:code" element={<Landing />} />

        <Route element={<MainLayout />}>
         <Route path="/Faturamento" element={<Dashboard />} />
         
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda-dia" element={<AgendaDia />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/indique" element={<Indique />} />
          <Route
  path="/convite/:codigo"
  element={<Convite />}
/>
          <Route path="/admin" element={<PrivateAdmin><Admin /></PrivateAdmin>
            

  }
/>
      </Route>
      </Routes>
    
  );
}

export default App;