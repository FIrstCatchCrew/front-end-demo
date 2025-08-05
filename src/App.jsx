import { useState } from 'react';

import './App.css';

function App() {
  const [tournaments, setTournaments] = useState([]);

  const handleClick = async () => {
    console.log('Button clicked');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tournament`);
      if (!res.ok) throw new Error('Failed to fetch tournaments');

      const data = await res.json();
      setTournaments(data);
      console.log('tournaments returned:', data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <div>
        <h1>My Demo Frontend</h1>
        <button onClick={handleClick}>Load Tournaments</button>

        <ul>
          {tournaments.map((t, index) => (
            <li key={index}>{t.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
