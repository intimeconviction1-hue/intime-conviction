// Le collecteur vit dans le dépôt privé, monté par le workflow dans articles-prives.
import { mettreAJour } from '../articles-prives/outils/actualites.mjs';

const fil = await mettreAJour();
if (fil.secours) console.warn(`Relevé indisponible : conservation de la version du ${fil.releveLe}.`);
else console.log(`${fil.articles.length} références mises à jour le ${fil.releveLe}.`);
