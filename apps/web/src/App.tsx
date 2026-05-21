import { useState } from 'react';
import ApiStatus from './components/ApiStatus';
import CreateBon from './components/CreateBon';
import GestionBon from './components/GestionBon';

export default function App() {
  const [view, setView] = useState<'home' | 'create' | 'edit'>('home');
  const [activeBonId, setActiveBonId] = useState<number | null>(null);

  return (
    <main className="app">
      <h1>Lafite Tracker</h1>
      {view === 'home' && <p>Gestion des bons de vendange</p>}

      {view === 'home' && (
        <>
          <ApiStatus />
          <div className="flex-actions" style={{ marginTop: '2rem' }}>
            <button onClick={() => setView('create')}>Créer un bon de vendange</button>
            <button className="secondary" onClick={() => alert('Liste des bons à venir !')}>
              Compléter un bon existant
            </button>
          </div>
        </>
      )}

      {view === 'create' && (
        <CreateBon
          onSuccess={(id) => {
            setActiveBonId(id);
            setView('edit');
          }}
          onCancel={() => setView('home')}
        />
      )}

      {view === 'edit' && activeBonId && (
        <GestionBon 
          bonId={activeBonId} 
          onBack={() => setView('home')} 
        />
      )}
    </main>
  );
}