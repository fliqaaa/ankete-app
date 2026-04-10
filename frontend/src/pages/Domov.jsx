import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Domov() {
  // stanje za ankete
  const [polls, setPolls] = useState([]);

  // stanje za nalaganje in napako
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // stanje za upload avatarja
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // ob nalaganju strani pridobimo vse ankete
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls');
        const data = await response.json();

        if (response.ok) {
          setPolls(data);
        } else {
          setError(data.error || 'Napaka pri pridobivanju anket.');
        }
      } catch (error) {
        console.error(error);
        setError('Napaka pri povezavi s strežnikom.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // upload avatarja
  const handleUpload = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Moraš biti prijavljen.');
      return;
    }

    if (!file) {
      setMessage('Izberi datoteko.');
      return;
    }

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
        setMessage('Avatar uspešno naložen!');
        window.location.reload();
      } else {
        setMessage(data.error || 'Napaka pri uploadu.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Napaka pri uploadu.');
    }
  };

  if (loading) {
    return <p>Nalaganje anket...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="section-title">Seznam anket</h1>

      

      {polls.length === 0 ? (
        <div className="card">
          <p>Trenutno ni nobene ankete.</p>
        </div>
      ) : (
        polls.map((poll) => (
          <div className="card" key={poll.id}>
            <h3>{poll.title}</h3>
            <p>Začetek: {new Date(poll.start_time).toLocaleString()}</p>
            <p>Konec: {new Date(poll.end_time).toLocaleString()}</p>

            <Link className="content-link" to={`/anketa/${poll.id}`}>
              Poglej anketo
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Domov;