import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // pridobi podatke prijavljenega uporabnika
  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // odpre file picker ob kliku na avatar
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // upload nove slike
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem('token');

    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Profilna slika posodobljena.');
        fetchUser();
      } else {
        setMessage(data.error || 'Napaka pri uploadu.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Napaka pri uploadu.');
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/prijava');
  };

  return (
    <nav className="navbar">
      <h2>Ankete App</h2>

      <div className="nav-links">
        <Link to="/domov">Domov</Link>
        <Link to="/ustvari">Nova anketa</Link>

        {/* skrit file input */}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* avatar - klik odpre file picker */}
        <div
          className="avatar-container clickable-avatar"
          onClick={handleAvatarClick}
          title="Klikni za menjavo profilne slike"
        >
          {user?.avatar ? (
            <img
              src={`http://localhost:5000/uploads/${user.avatar}`}
              alt="avatar"
              className="avatar-img"
            />
          ) : (
            <div className="avatar-placeholder">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <span className="user-email">
          {user?.email || localStorage.getItem('userEmail')}
        </span>

        <button className="logout-btn" onClick={handleLogout}>
          Odjava
        </button>
      </div>

      {/* opcijsko sporočilo */}
      {message && <p className="avatar-message">{message}</p>}
    </nav>
  );
}

export default Navbar;