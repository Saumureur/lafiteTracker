import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Génère le certificat HTTPS automatiquement
  ],
  server: {
    host: true, // Autorise l'accès depuis le réseau local
    port: 5173,
    // Optionnel mais très recommandé pour éviter les erreurs "Mixed Content" :
    // On demande à Vite de relayer les appels API vers NestJS en interne
    proxy: {
      '/api': {
        target: 'http://api:3000', // L'adresse interne de ton backend NestJS
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});