import { useState, useEffect } from 'react';
import ApiStatus from './components/ApiStatus';
import CreateBon from './components/CreateBon';
import GestionBon from './components/GestionBon';
import ListBons from './components/ListeBons';
import Login from './components/Login';

export default function App() {
  const [view, setView] = useState<'login' | 'home' | 'create' | 'edit' | 'list'>('login');
  const [activeBonId, setActiveBonId] = useState<number | null>(null);

  // Vérification du token au chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setView('home'); // Si on a un jeton, on va direct à l'accueil
    } else {
      setView('login'); // Sinon, on reste sur l'écran de connexion
    }
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_roles');
    setView('login');
  };

  // Si la vue est 'login', on n'affiche QUE le composant de connexion (pas de header, pas de menus)
  if (view === 'login') {
    return <Login onLoginSuccess={() => setView('home')} />;
  }

  return (
    <main className="app" style={{ maxWidth: view === 'edit' || view === 'list' ? '60rem' : '40rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Lafite Tracker</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Déconnexion
        </button>
      </header>

      {view === 'home' && <p>Gestion des bons de vendange</p>}

      {view === 'home' && (
        <>
          <ApiStatus />
          <div className="flex-actions" style={{ marginTop: '2rem' }}>
            <button onClick={() => setView('create')}>Créer un bon de vendange</button>
            {/* Remplacement de l'alert par le changement de vue */}
            <button className="secondary" onClick={() => setView('list')}>
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

      {view === 'list' && (
        <ListBons
          onSelectBon={(id) => {
            setActiveBonId(id);
            setView('edit'); // Ouvre directement le bon sélectionné dans l'éditeur
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