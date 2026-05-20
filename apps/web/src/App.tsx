import { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

type ApiStatus = {
  status: string;
  service: string;
  timestamp: string;
  database: string;
};

export default function App() {

  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);



useEffect(() => {

  function onScanSuccess(decodedText:any, decodedResult:any) {
    html5QrcodeScanner.clear();
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
}
  function onScanError() {
  // handle the scanned code as you like, for example:
  console.log(`Code not matched `);
}

  let config = {
    fps: 10,
    qrbox: {width: 400, height: 400},
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
  };

  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", config, /* verbose= */ false);
  html5QrcodeScanner.render(onScanSuccess, onScanError);
  
  }, []);


  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://192.168.1.5:3000';
    fetch(`${baseUrl}/status`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setApiStatus)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="app">
      <h1>Lafite Tracker</h1>
      <p>Monorepo pnpm — React + NestJS + SQL Server</p>
      <section className="card">
        <h2>API /status</h2>
        {error && <p className="error">{error}</p>}
        {apiStatus && <pre>{JSON.stringify(apiStatus, null, 2)}</pre>}
        {!apiStatus && !error && <p>Chargement…</p>}
      </section>
      <section>
        <div id="reader"/>
      </section>
    </main>
  );
}
