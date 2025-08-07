import { useState } from 'react';

import './App.css';

function App() {
  const [fishCatch, setFishCatch] = useState([]);

  const handleClick = async () => {
    console.log('Button clicked');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_CATCH_ENDPOINT}/available`
      );
      if (!res.ok) throw new Error('Failed to fetch catches');

      const data = await res.json();
      setFishCatch(data);
      console.log('fish catches returned:', data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <div>
        <h1>My Demo Frontend</h1>
        <button onClick={handleClick}>See Available Catches</button>

        <ul>
          {fishCatch.map((t, index) => (
            <li key={index}>{t.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
