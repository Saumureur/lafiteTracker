import { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function QrScanner() {
  useEffect(() => {
    async function onScanSuccess(decodedText: string) {
      html5QrcodeScanner.clear();

      console.log("QR détecté :", decodedText);

      const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

      // extrait le numéro
      const number = decodedText.replace("palette:", "");

      try {
        const res = await fetch(`${baseUrl}/pallete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: Number(number),
          }),
        });

        const data = await res.json();

        console.log("Sauvegardé en DB :", data);
      } catch (err) {
        console.error("Erreur API :", err);
      }
    }

    function onScanError() {
      console.log(`Code not matched `);
    }

    let config = {
      fps: 10,
      qrbox: { width: 400, height: 400 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", config, /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanError);
  }, []);

  return (
    <section>
      <div id="reader" />
    </section>
  );
}
