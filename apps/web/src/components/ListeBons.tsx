import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

interface BonSimple {
  id: number;
  remorque: string;
  parcelle: string;
  millesime: number;
  status: string;
  createdAt: string;
}

interface ListBonsProps {
  onSelectBon: (id: number) => void;
  onCancel: () => void;
}

export default function ListBons({ onSelectBon, onCancel }: ListBonsProps) {
  const [bons, setBons] = useState<BonSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = '/api';
    
    apiFetch(`${baseUrl}/bon-vendange`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des bons');
        return res.json();
      })
      .then(setBons)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des bons en cours...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="card" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Sélectionner un bon de vendange</h2>
        <button className="secondary" onClick={onCancel}>Retour</button>
      </div>

      {bons.length === 0 ? (
        <p>Aucun bon de vendange en cours de modification actuellement.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #3d3830' }}>
              <th style={{ padding: '0.5rem' }}>N° Bon</th>
              <th style={{ padding: '0.5rem' }}>Remorque</th>
              <th style={{ padding: '0.5rem' }}>Parcelle</th>
              <th style={{ padding: '0.5rem' }}>Millésime</th>
              <th style={{ padding: '0.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bons.map((bon) => (
              <tr key={bon.id} style={{ borderBottom: '1px solid #3d3830' }}>
                <td style={{ padding: '0.5rem' }}>#{bon.id}</td>
                <td style={{ padding: '0.5rem' }}>{bon.remorque}</td>
                <td style={{ padding: '0.5rem' }}>{bon.parcelle}</td>
                <td style={{ padding: '0.5rem' }}>{bon.millesime}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button 
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }} 
                    onClick={() => onSelectBon(bon.id)}
                  >
                    Ouvrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}