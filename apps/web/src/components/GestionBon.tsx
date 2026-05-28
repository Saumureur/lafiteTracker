import { useEffect, useState } from 'react';
import QrScanner from './QrScanner';
import { apiFetch } from '../utils/api';

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

  const baseUrl = '/api';

  // 1. Récupération initiale du bon et de ses palettes/cagettes
  const fetchBonDetails = async () => {
    try {
      const res = await apiFetch(`${baseUrl}/bon-vendange/${bonId}`);
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
        const res = await apiFetch(`${baseUrl}/palette`, {
          method: 'POST',
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
        const res = await apiFetch(`${baseUrl}/cagette`, {
          method: 'POST',
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

  // 1. Met à jour UNIQUEMENT l'affichage en direct à chaque clic de flèche ou frappe
  const handleWeightChange = (cagetteId: number, poids: number) => {
    setBon((prevBon) => {
      if (!prevBon) return prevBon;
      return {
        ...prevBon,
        palettes: prevBon.palettes.map((palette) => ({
          ...palette,
          cagettes: palette.cagettes.map((cagette) => 
            cagette.id === cagetteId ? { ...cagette, poids: poids } : cagette
          ),
        })),
      };
    });
  };

  // 2. Envoie la donnée au serveur uniquement quand on valide
  const handleWeightSave = async (cagetteId: number, poids: number) => {
    localStorage.setItem(`cagette_poids_${cagetteId}`, poids.toString());
    try {
      const res = await apiFetch(`${baseUrl}/cagette/${cagetteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ poids }),
      });

      if (res.ok) {-
        await fetchBonDetails();
      }

    } catch (err) {
      console.warn("Échec de la sauvegarde serveur :", err);
    }
  };

  // Sauvegarde automatique de la cuve
  const handleCuveBlur = async () => {
    // Si la case est vide, on ne fait rien
    if (cuve.trim() === '') return;

    try {
      const res = await apiFetch(`${baseUrl}/bon-vendange/${bonId}`, {
        method: 'PATCH',
        body: JSON.stringify({ cuve }),
      });
      if (res.ok) {
        console.log("Cuve sauvegardée en base de données.");
        await fetchBonDetails();
      }
    } catch (err) {
      console.warn("Échec de la sauvegarde de la cuve :", err);
    }
  };

  const handleCloturerBon = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir clôturer ce bon ? Poids total de la palette : ${poidsTotalPalette} kg. Cette action est irréversible.`)) {
      return;
    }

    try {
      const res = await apiFetch(`${baseUrl}/bon-vendange/${bonId}/cloturer`, {
        method: 'PATCH',
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
          onBlur={handleCuveBlur}
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
                        value={row.data?.poids ?? ''} 
                        onChange={(e) => row.data && handleWeightChange(row.data.id, Number(e.target.value))}
                        onBlur={(e) => row.data && handleWeightSave(row.data.id, Number(e.target.value))}
                        onKeyDown={(e) => {
                          // Si l'opérateur appuie sur la touche Entrée, on retire le focus de la case
                          // Ce qui déclenche automatiquement le onBlur et donc la sauvegarde !
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
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

      <div className="card" style={{ marginTop: '2rem', padding: '1rem', background: '#1a1814', borderRadius: '6px', borderTop: '2px solid #e07a6a' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Historique des modifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* @ts-ignore */}
          {bon.logs && bon.logs.map((log: any) => (
            <div key={log.id} style={{ padding: '10px', backgroundColor: '#26231e', borderRadius: '4px', fontSize: '0.9rem', borderLeft: '4px solid #e07a6a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a8a29e', marginBottom: '5px' }}>
                <span><strong>{new Date(log.createdAt).toLocaleString('fr-FR')}</strong></span>
                <span>Par : <strong>{log.username}</strong> ({log.role})</span>
              </div>
              <div style={{ color: '#e8e4dc' }}>
                <span style={{ background: '#e07a6a', color: '#fff', padding: '2px 6px', borderRadius: '3px', marginRight: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {log.action}
                </span>
                {log.details}
              </div>
            </div>
          ))}
          {/* @ts-ignore */}
          {(!bon.logs || bon.logs.length === 0) && (
            <p style={{ color: '#888', margin: 0 }}>Aucun historique disponible pour ce bon.</p>
          )}
        </div>
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
          <div style={{ width: '100%', maxWidth: '500px', height:'auto', padding: '1rem' }}>
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