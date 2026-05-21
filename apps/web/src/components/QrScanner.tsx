import { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function QrScanner() {
  useEffect(() => {
    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", 
      {
        fps: 10,
        qrbox: { width: 400, height: 400 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      }, 
      false
    );

    async function onScanSuccess(decodedText: string) {
      html5QrcodeScanner.clear();
      console.log("QR détecté :", decodedText);

      let paletteNumber: number;

      try {
        const qrData = JSON.parse(decodedText);
        
        if (qrData.palette === undefined) {
          console.error("La clé 'palette' est introuvable dans le QR code.");
          return;
        }
        paletteNumber = qrData.palette;
      } catch (e) {
        console.error("Le QR code scanné n'est pas un JSON valide :", decodedText);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

      try {
        const res = await fetch(`${baseUrl}/palette`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: Number(paletteNumber),
          }),
        });

        const data = await res.json();
        console.log("Sauvegardé en DB :", data);
      } catch (err) {
        console.error("Erreur API :", err);
      }
    }

    function onScanError() {
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Erreur lors de l'arrêt du scanner :", error);
      });
    };
  }, []);

  return (
    <section>
      <div id="reader" />
    </section>
  );
}