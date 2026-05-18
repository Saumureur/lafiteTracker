import { useEffect, useState } from 'react';

type ApiStatus = {
  status: string;
  service: string;
  timestamp: string;
  database: string;
};

export default function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    fetch(`${baseUrl}/status`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setApiStatus)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="app">
      <h1>Lafite Tracker</h1>
      <p>Monorepo pnpm — React + NestJS + SQL Server</p>
      <section className="card">
        <h2>API /status</h2>
        {error && <p className="error">{error}</p>}
        {apiStatus && <pre>{JSON.stringify(apiStatus, null, 2)}</pre>}
        {!apiStatus && !error && <p>Chargement…</p>}
      </section>
    </main>
  );
}
