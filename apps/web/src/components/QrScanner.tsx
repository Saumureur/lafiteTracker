import { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface QrScannerProps {
  expectedKey: 'palette' | 'cagette';
  onSuccess: (scannedNumber: number) => void;
  onClose: () => void;
}

export default function QrScanner({ expectedKey, onSuccess, onClose }: QrScannerProps) {
  useEffect(() => {
    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", 
      {
        fps: 10,
        qrbox: { width: 300, height: 300 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      }, 
      false
    );

    async function onScanSuccess(decodedText: string) {
      try {
        const qrData = JSON.parse(decodedText);
        
        if (qrData[expectedKey] === undefined) {
          console.error(`Mauvais QR Code. On attendait une ${expectedKey}.`);
          return;
        }
        
        html5QrcodeScanner.clear();
        onSuccess(Number(qrData[expectedKey]));
        
      } catch (e) {
        console.error("Le QR code n'est pas un JSON valide.");
      }
    }

    html5QrcodeScanner.render(onScanSuccess, () => {});

    return () => {
      html5QrcodeScanner.clear().catch(() => {});
    };
  }, [expectedKey, onSuccess]);

  return (
    <section className="card" style={{ marginTop: '1rem', border: '2px solid #e8e4dc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Scan de {expectedKey}</h3>
        <button className="secondary" onClick={onClose}>Fermer la caméra</button>
      </div>
      <div id="reader" style={{ marginTop: '1rem' }} />
    </section>
  );
}