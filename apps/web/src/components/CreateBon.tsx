import { useState } from 'react';

interface CreateBonProps {
  onSuccess: (bonId: number) => void;
  onCancel: () => void;
}

export default function CreateBon({ onSuccess, onCancel }: CreateBonProps) {
  const [remorque, setRemorque] = useState('');
  const [parcelle, setParcelle] = useState('');
  const [millesime, setMillesime] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    try {
      const res = await fetch(`${baseUrl}/bon-vendange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remorque, parcelle, millesime }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du bon');
      
      const data = await res.json();
      onSuccess(data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Nouveau Bon de Vendange</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Numéro de Remorque</label>
          <input required value={remorque} onChange={(e) => setRemorque(e.target.value)} placeholder="Ex: Remorque 1" />
        </div>
        
        <div className="form-group">
          <label>Parcelle</label>
          <input required value={parcelle} onChange={(e) => setParcelle(e.target.value)} placeholder="Ex: Parcelle Nord" />
        </div>
        
        <div className="form-group">
          <label>Millésime</label>
          <input type="number" required value={millesime} onChange={(e) => setMillesime(Number(e.target.value))} />
        </div>

        <div className="flex-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer le bon'}
          </button>
          <button type="button" className="secondary" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}