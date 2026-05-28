import { useState } from 'react';
import { apiFetch } from '../utils/api';

interface CreateBonProps {
  onSuccess: (bonId: number) => void;
  onCancel: () => void;
}

export default function CreateBon({ onSuccess, onCancel }: CreateBonProps) {
  const [remorque, setRemorque] = useState('');
  const [parcelle, setParcelle] = useState('');
  const [millesime, setMillesime] = useState(new Date().getFullYear());
  const [sepage, setSepage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const baseUrl = '/api';

    try {
      const res = await apiFetch(`${baseUrl}/bon-vendange`, {
        method: 'POST',
        body: JSON.stringify({
          remorque,
          parcelle,
          sepage,
          millesime: Number(millesime),
        }),
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Vous devez être Administrateur pour créer un bon.");
        throw new Error("Erreur serveur");
      }
      
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

        <div className="form-group">
          <label htmlFor="sepage">Cépage</label>
          <select id="sepage" value={sepage} onChange={(e) => setSepage(e.target.value)} required className="form-control">
            <option value="">-- Choisir un cépage --</option>
            <option value="Merlot">Merlot</option>
            <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
            <option value="Cabernet Franc">Cabernet Franc</option>
            <option value="Sauvignon Blanc">Sauvignon Blanc</option>
            <option value="Semillon">Sémillon</option>
          </select>
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