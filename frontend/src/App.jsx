// uvoz React Router komponent
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

// uvoz strani
import Domov from './pages/Domov';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import UstvariAnketo from './pages/UstvariAnketo';
import AnketaPodrobnosti from './pages/AnketaPodrobnosti';

// uvoz CSS
import './App.css';

// zaščitena pot - če ni tokena, uporabnika preusmeri na prijavo
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/prijava" replace />;
  }

  return children;
}

// glavna vsebina aplikacije
function AppContent() {
  const navigate = useNavigate();

  // podatki prijavljenega uporabnika
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  // odjava
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/prijava');
  };

  return (
    <div className="app">
      {/* navbar pokažemo samo prijavljenemu uporabniku */}
      {token && (
        <nav className="navbar">
          <h2>Ankete App</h2>

          <div className="nav-links">
            <Link to="/domov">Domov</Link>
            <Link to="/ustvari">Nova anketa</Link>
            <span className="user-email">{userEmail}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Odjava
            </button>
          </div>
        </nav>
      )}

      <Routes>
        {/* začetna pot */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/domov" replace /> : <Navigate to="/prijava" replace />
          }
        />

        {/* javne strani */}
        <Route path="/prijava" element={<Prijava />} />
        <Route path="/registracija" element={<Registracija />} />

        {/* zaščitene strani */}
        <Route
          path="/domov"
          element={
            <ProtectedRoute>
              <Domov />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ustvari"
          element={
            <ProtectedRoute>
              <UstvariAnketo />
            </ProtectedRoute>
          }
        />

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

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;