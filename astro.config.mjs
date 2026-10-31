import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.intimeconviction.fr',
  // Les adresses de l'ancien WordPress finissent toutes par une barre
  // (/titre/mois/année/) : on garde la même forme, sinon chaque lien déjà
  // partagé passerait par une redirection.
  trailingSlash: 'always',
  build: { format: 'directory' },
});
