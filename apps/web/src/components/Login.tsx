import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Identifiants Windows incorrects ou accès refusé');
      }

      const data = await response.json();
      
      // Stockage du jeton et des rôles
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_roles', JSON.stringify(data.user.roles));

      // On prévient App.tsx que la connexion est réussie !
      onLoginSuccess();
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Connexion Lafite Tracker</h2>
      
      {error && <div style={{ color: 'white', backgroundColor: '#d32f2f', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Identifiant Windows</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mot de passe</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#8B0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}