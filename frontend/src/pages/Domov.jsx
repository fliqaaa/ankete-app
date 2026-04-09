import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Domov() {
  // stanje za ankete
  const [polls, setPolls] = useState([]);

  // stanje za nalaganje in napako
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <p>Nalaganje anket...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="section-title">SEZNAM ANKET</h1>

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