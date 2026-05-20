import ApiStatus from './components/ApiStatus';
import QrScanner from './components/QrScanner';

export default function App() {
  return (
    <main className="app">
      <h1>Lafite Tracker</h1>
      <p>Monorepo pnpm — React + NestJS + SQL Server</p>
      <ApiStatus />
      <QrScanner />
    </main>
  );
}
