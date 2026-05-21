import { useEffect, useState } from 'react';
import QrScanner from './QrScanner';

interface Cagette {
  id: number;
  number: number;
  poids: number;
}

interface Palette {
  id: number;
  number: number;
  cagettes: Cagette[];
}

interface BonVendange {
  id: number;
  remorque: string;
  parcelle: string;
  millesime: number;
  cuve: string | null;
  status: 'EN_COURS' | 'CLOTURE';
  palettes: Palette[];
}

interface GestionBonProps {
  bonId: number;
  onBack: () => void;
}

export default function GestionBon({ bonId, onBack }: GestionBonProps) {
  const [bon, setBon] = useState<BonVendange | null>(null);
  const [cuve, setCuve] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la modale du scanner QR
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'palette' | 'cagette' | null>(null);
  const [activeCagetteIndex, setActiveCagetteIndex] = useState<number | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  // 1. Récupération initiale du bon et de ses palettes/cagettes
  const fetchBonDetails = async () => {
    try {
      const res = await fetch(`${baseUrl}/bon-vendange/${bonId}`);
      if (!res.ok) throw new Error('Impossible de charger le bon de vendange.');
      const data = await res.json();
      setBon(data);
      setCuve(data.cuve ?? '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonDetails();
  }, [bonId]);

  // Trouve la palette active (la dernière ajoutée ou celle en cours de remplissage)
  const activePalette = bon?.palettes[bon?.palettes.length - 1] || null;

  // Calcul du poids total de la palette active
  const poidsTotalPalette = activePalette
    ? activePalette.cagettes.reduce((sum, c) => sum + c.poids, 0)
    : 0;

  // Vérification des conditions de clôture (25 cagettes + cuve renseignée)
  const canCloturer = 
    bon?.status === 'EN_COURS' && 
    cuve.trim() !== '' && 
    activePalette !== null && 
    activePalette.cagettes.length === 25;

  // 2. Gestion du scan QR Code
  const handleScanSuccess = async (scannedNumber: number) => {
    setScannerOpen(false);
    if (!bon) return;

    if (scannerTarget === 'palette') {
      // Ajout d'une nouvelle palette au bon
      try {
        const res = await fetch(`${baseUrl}/palette`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: scannedNumber, bonVendangeId: bon.id }),
        });
        if (!res.ok) throw new Error('Erreur lors de l\'association de la palette.');
        await fetchBonDetails(); // Rechargement des données
      } catch (err: any) {
        alert(err.message);
      }
    } else if (scannerTarget === 'cagette' && activePalette) {
      // Ajout ou mise à jour d'un numéro de cagette dans le tableau
      try {
        const res = await fetch(`${baseUrl}/cagette`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            number: scannedNumber, 
            poids: 0, 
            paletteId: activePalette.id,
            bonVendangeId: bon.id
          }),
        });
        if (!res.ok) throw new Error('Erreur lors de l\'ajout de la cagette.');
        await fetchBonDetails();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // 3. Sauvegarde automatique (Auto-save) au changement de focus (onBlur)
  const handleWeightBlur = async (cagetteId: number, poids: number) => {
    // Optionnel : sauvegarde locale dans le localStorage en cas de coupure réseau
    localStorage.setItem(`cagette_poids_${cagetteId}`, poids.toString());

    try {
      await fetch(`${baseUrl}/cagette/${cagetteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poids }),
      });
      // Mise à jour visuelle discrète sans recharger tout le composant
    } catch (err) {
      console.warn("Échec de la sauvegarde serveur, donnée conservée localement :", err);
    }
  };

  const handleCloturerBon = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir clôturer ce bon ? Poids total de la palette : ${poidsTotalPalette} kg. Cette action est irréversible.`)) {
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/bon-vendange/${bonId}/cloturer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuve }),
      });
      if (!res.ok) throw new Error('Erreur lors de la clôture.');
      alert('Bon de vendange clôturé avec succès !');
      onBack();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Chargement du bon de vendange...</p>;
  if (error || !bon) return <p className="error">{error ?? 'Une erreur est survenue'}</p>;

  // Génération des 25 lignes fixes pour le tableau de pesée de la palette active
  const rows = Array.from({ length: 25 }, (_, index) => {
    const cagette = activePalette?.cagettes[index] || null;
    return { index: index + 1, data: cagette };
  });

  return (
    <div className="card" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Bon de Vendange n° {bon.id} ({bon.status})</h2>
        <button className="secondary" onClick={onBack}>Retour</button>
      </div>

      {/* Informations contextuelles fixes */}
      <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0', background: '#1a1814', padding: '1rem', borderRadius: '6px' }}>
        <p><strong>Remorque :</strong> {bon.remorque}</p>
        <p><strong>Parcelle :</strong> {bon.parcelle}</p>
        <p><strong>Millésime :</strong> {bon.millesime}</p>
      </div>

      {/* Choix de la Cuve (Obligatoire pour finaliser) */}
      <div className="form-group" style={{ margin: '1.5rem 0' }}>
        <label><strong>Cuve de destination :</strong></label>
        <input 
          disabled={bon.status === 'CLOTURE'}
          value={cuve} 
          onChange={(e) => setCuve(e.target.value)}
          placeholder="Ex: Cuve Inox A3"
        />
      </div>

      {/* Section Palette RFID */}
      <div style={{ borderTop: '1px solid #3d3830', paddingTop: '1rem' }}>
        <h3>Palette Active</h3>
        {!activePalette ? (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p className="error">Aucune palette associée à ce bon pour le moment.</p>
            <button onClick={() => { setScannerTarget('palette'); setScannerOpen(true); }}>
              Scanner le QR / RFID d'une Palette
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p><strong>N° de Palette :</strong> {activePalette.number}</p>
              <p style={{ fontSize: '1.25rem' }}>
                <strong>Poids Total : <span style={{ color: '#e8e4dc' }}>{poidsTotalPalette} kg</span></strong>
              </p>
            </div>

            {/* Tableau des 25 cagettes */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #3d3830' }}>
                  <th style={{ padding: '0.5rem' }}>Emplacement</th>
                  <th style={{ padding: '0.5rem' }}>N° Cagette (QR)</th>
                  <th style={{ padding: '0.5rem' }}>Poids (kg)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.index} style={{ borderBottom: '1px solid #3d3830' }}>
                    <td style={{ padding: '0.5rem' }}>Cagette #{row.index}</td>
                    <td style={{ padding: '0.5rem' }}>
                      {row.data ? (
                        <span>{row.data.number}</span>
                      ) : (
                        bon.status === 'EN_COURS' && (
                          <button 
                            className="secondary" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                            onClick={() => {
                              setScannerTarget('cagette');
                              setActiveCagetteIndex(row.index);
                              setScannerOpen(true);
                            }}
                          >
                            Scanner QR
                          </button>
                        )
                      )}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input 
                        type="number"
                        disabled={!row.data || bon.status === 'CLOTURE'}
                        style={{ width: '100px', padding: '0.25rem' }}
                        defaultValue={row.data?.poids ?? ''}
                        onBlur={(e) => row.data && handleWeightBlur(row.data.id, Number(e.target.value))}
                        placeholder="0.0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bouton de renouvellement si palette pleine et bon non clôturé */}
            {activePalette.cagettes.length === 25 && bon.status === 'EN_COURS' && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button className="secondary" onClick={() => { setScannerTarget('palette'); setScannerOpen(true); }}>
                  + Associer une nouvelle palette (Suivante)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions de Clôture */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #3d3830', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          disabled={!canCloturer} 
          onClick={handleCloturerBon}
          style={{ 
            background: canCloturer ? '#e07a6a' : '#3d3830', 
            color: canCloturer ? '#fff' : '#888',
            cursor: canCloturer ? 'pointer' : 'not-allowed'
          }}
        >
          Clôturer définitivement le bon
        </button>
      </div>

      {/* Intégration du Scanner Modal */}
      {scannerOpen && scannerTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ width: '100%', maxWidth: '500px', padding: '1rem' }}>
            <QrScanner 
              expectedKey={scannerTarget}
              onSuccess={handleScanSuccess}
              onClose={() => setScannerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}