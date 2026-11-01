import { mettreAJour } from '../src/lib/fil-actualites.mjs';
const fil = await mettreAJour();
if (fil.secours) console.warn(`Google indisponible : conservation du relevé du ${fil.releveLe}.`);
else console.log(`${fil.articles.length} nouvelles relevées le ${fil.releveLe}.`);
