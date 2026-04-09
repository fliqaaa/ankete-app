import { useState } from 'react';

function UstvariAnketo() {
  // stanje za podatke ankete
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  // sprememba opcije
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // dodaj novo možnost
  const addOption = () => {
    setOptions([...options, '']);
  };

  // submit obrazca
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Moraš biti prijavljen.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          options,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Anketa uspešno ustvarjena!');
        setTitle('');
        setOptions(['', '']);
        setStartTime('');
        setEndTime('');
      } else {
        setMessage(data.error || 'Napaka pri ustvarjanju ankete.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Napaka pri povezavi.');
    }
  };

  return (
    <div className="card">
      <h1 className="section-title">USTVARI ANKETO</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naslov:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Možnosti:</label>

          {options.map((opt, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Možnost ${index + 1}`}
                required
              />
            </div>
          ))}

          <button type="button" onClick={addOption}>
            + Dodaj možnost
          </button>
        </div>

        <div className="form-group">
          <label>Začetek:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Konec:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ustvari anketo</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UstvariAnketo;