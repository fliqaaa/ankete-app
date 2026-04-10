// uvoz React Router komponent
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// uvoz strani
import Domov from './pages/Domov';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import UstvariAnketo from './pages/UstvariAnketo';
import AnketaPodrobnosti from './pages/AnketaPodrobnosti';

// uvoz Navbar komponente (z avatarjem)
import Navbar from "./components/Navbar";

// uvoz CSS
import './App.css';


//  ZAŠČITENA POT
// preveri ali ima uporabnik token
// če ga nima ga preusmeri na prijavo
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/prijava" replace />;
  }

  return children;
}


//  GLAVNA LOGIKA APLIKACIJE
function AppContent() {
  const navigate = useNavigate();

  // preverimo če je uporabnik prijavljen
  const token = localStorage.getItem('token');

  return (
    <div className="app">

      {/*  NAVBAR (prikazan samo prijavljenemu uporabniku) */}
      {token && <Navbar />}

      <Routes>

        {/*  ZAČETNA POT */}
        <Route
          path="/"
          element={
            token 
              ? <Navigate to="/domov" replace /> 
              : <Navigate to="/prijava" replace />
          }
        />

        {/*  JAVNE STRANI */}
        <Route path="/prijava" element={<Prijava />} />
        <Route path="/registracija" element={<Registracija />} />

        {/*  ZAŠČITENE STRANI */}

        {/* DOMOV */}
        <Route
          path="/domov"
          element={
            <ProtectedRoute>
              <Domov />
            </ProtectedRoute>
          }
        />

        {/* USTVARI ANKETO */}
        <Route
          path="/ustvari"
          element={
            <ProtectedRoute>
              <UstvariAnketo />
            </ProtectedRoute>
          }
        />

        {/* PODROBNOSTI ANKETE */}
        <Route
          path="/anketa/:id"
          element={
            <ProtectedRoute>
              <AnketaPodrobnosti />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}


// root komponenta
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;