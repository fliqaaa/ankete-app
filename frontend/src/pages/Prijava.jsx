import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Prijava() {
  // stanje za polja
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // sporočilo uporabniku
  const [message, setMessage] = useState('');

  // za preusmeritev po prijavi
  const navigate = useNavigate();

  // submit login obrazca
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // shranimo token in email
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);

        setMessage('Prijava uspešna!');
        navigate('/domov');
      } else {
        setMessage(data.error || 'Napaka pri prijavi.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Napaka pri povezavi s strežnikom.');
    }
  };

  return (
    <div className="card">
      <h1 className="section-title">Prijava</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Geslo:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Prijavi se</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p style={{ marginTop: '15px' }}>
        Nimaš računa?{' '}
        <Link className="content-link" to="/registracija">
          Registriraj se
        </Link>
      </p>
    </div>
  );
}

export default Prijava;