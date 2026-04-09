import { useState } from 'react';
import { Link } from 'react-router-dom';

function Registracija() {
  // stanje za polja
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // sporočilo uporabniku
  const [message, setMessage] = useState('');

  // submit register obrazca
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registracija uspešna!');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.error || 'Napaka pri registraciji.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Napaka pri povezavi s strežnikom.');
    }
  };

  return (
    <div className="card">
      <h1 className="section-title">Registracija</h1>

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

        <button type="submit">Registriraj se</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p style={{ marginTop: '15px' }}>
        Že imaš račun?{' '}
        <Link className="content-link" to="/prijava">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}

export default Registracija;