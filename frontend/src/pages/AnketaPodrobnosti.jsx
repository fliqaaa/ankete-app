import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AnketaPodrobnosti() {
  // ID ankete iz URL-ja
  const { id } = useParams();

  // podatki ankete
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);

  // izbrana možnost
  const [selectedOption, setSelectedOption] = useState('');

  // rezultati
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // pridobi podatke o anketi
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/polls/${id}`);
        const data = await response.json();

        if (response.ok) {
          setPoll(data.poll);
          setOptions(data.options);
        } else {
          setError(data.error || 'Napaka pri pridobivanju ankete.');
        }
      } catch (error) {
        console.error(error);
        setError('Napaka pri povezavi s strežnikom.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  // pridobi rezultate
  const fetchResults = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/polls/${id}/results`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        setShowResults(true);
      } else {
        setMessage(data.error || 'Napaka pri pridobivanju rezultatov.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Napaka pri povezavi s strežnikom.');
    }
  };

  // oddaja glasu
  const handleVote = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Za glasovanje moraš biti prijavljen.');
      return;
    }

    if (!selectedOption) {
      setMessage('Izberi eno možnost.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/polls/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          option_id: Number(selectedOption),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Glas uspešno oddan.');
        fetchResults();
      } else {
        setMessage(data.error || 'Napaka pri glasovanju.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Napaka pri povezavi s strežnikom.');
    }
  };

  if (loading) {
    return <p>Nalaganje ankete...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="card">
      <h1 className="section-title">{poll.title}</h1>
      <p>Začetek: {new Date(poll.start_time).toLocaleString()}</p>
      <p>Konec: {new Date(poll.end_time).toLocaleString()}</p>

      <form onSubmit={handleVote}>
        <h3>Izberi možnost:</h3>

        {options.map((option) => (
          <div className="option-row" key={option.id}>
            <label>
              <input
                type="radio"
                name="option"
                value={option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{ width: 'auto', marginRight: '8px' }}
              />
              {option.text}
            </label>
          </div>
        ))}

        <button type="submit">Oddaj glas</button>

        <button
          type="button"
          className="secondary-btn"
          onClick={fetchResults}
        >
          Pokaži rezultate
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {showResults && (
        <div style={{ marginTop: '25px' }}>
          <h3>Rezultati ankete</h3>

          {results.length === 0 ? (
            <p>Ni rezultatov.</p>
          ) : (
            <ul className="results-list">
              {results.map((result) => (
                <li key={result.id}>
                  {result.text} - {result.votes_count} glasov
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AnketaPodrobnosti;