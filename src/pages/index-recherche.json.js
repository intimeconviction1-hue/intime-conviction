// Index des titres et résumés pour /recherche/. Il était écrit DANS la page :
// 1,4 Mo de HTML à télécharger avant d'afficher le moindre champ. Servi à part,
// la page s'affiche tout de suite et le navigateur garde l'index en cache.
import { tousLesArticles } from '../lib/articles.mjs';
import { rubrique as trouverRubrique } from '../lib/rubriques.mjs';

export async function GET() {
  const articles = await tousLesArticles();
  const index = articles.filter(({ data }) => data.verificationEnCours !== true).map(({ data: d }) => ({
    titre: d.titre, chemin: d.chemin, rubrique: d.rubrique,
    rubriqueNom: trouverRubrique(d.rubrique).libelle,
    annee: d.date.getFullYear(), extrait: d.extrait,
  }));
  return Response.json(index);
}
