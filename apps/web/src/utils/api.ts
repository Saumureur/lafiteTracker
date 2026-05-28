// src/utils/api.ts

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // 1. On récupère le token stocké au moment du login
  const token = localStorage.getItem('access_token');

  // 2. On prépare les en-têtes (Headers)
  const headers = new Headers(options.headers || {});
  
  // Si on a un token, on l'ajoute dans le header Authorization
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Par défaut, on s'assure d'envoyer et recevoir du JSON
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. On lance la vraie requête fetch avec nos options modifiées
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  // 4. Gestion globale des erreurs de sécurité (Optionnel mais très utile)
  if (response.status === 401) {
    // 401 = Token expiré ou invalide -> On déconnecte l'utilisateur
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_roles');
    window.location.reload(); // Force le retour à l'écran de Login
  }

  if (response.status === 403) {
    // 403 = L'utilisateur est connecté, mais n'a pas le bon rôle (ex: Lecteur qui essaie de créer un bon)
    console.error("Accès refusé : vous n'avez pas les droits nécessaires.");
  }

  return response;
}