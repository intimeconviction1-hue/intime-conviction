import { defineConfig } from 'astro/config';
import { redirectionsDesCategories } from './src/lib/anciennes-adresses.mjs';

export default defineConfig({
  site: 'https://www.intimeconviction.fr',
  vite: { server: { allowedHosts: ['terminal.local'] } },
  // Les adresses de l'ancien WordPress finissent toutes par une barre
  // (/titre/mois/année/) : on garde la même forme, sinon chaque lien déjà
  // partagé passerait par une redirection.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // GitHub Pages ne sait pas renvoyer un vrai 301 : Astro écrit une page de
  // redirection immédiate (meta refresh + adresse canonique), que Google
  // traite comme une redirection permanente.
  redirects: redirectionsDesCategories(),
});
