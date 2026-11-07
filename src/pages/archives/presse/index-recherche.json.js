import { lireVeille } from '../../../../lib/veille.mjs';

// Export purement public: titre, source, URL canonique et date d'ALERTE.
// Les corps des courriels, leurs expéditeurs et les pièces jointes sont exclus.
export async function GET() {
 const v = await lireVeille();
 const articles = v.articles.map(x=>[x.titre,x.source,x.lien,x.dateAlerte]);
 return new Response(JSON.stringify({maj:v.importeLe??null,articles}), {
   status:200,
   headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
 });
}
