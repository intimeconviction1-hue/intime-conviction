import { tousLesArticles } from '../lib/articles.mjs';
import { normaliser } from '../lib/recherche.mjs';
import { decodeHTML } from 'entities';

export async function GET() {
  const articles = await tousLesArticles();
  const corps = articles.filter(({ data }) => data.verificationEnCours !== true).map(({ data }) => {
    const texte = decodeHTML(data.html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' '));
    return [data.chemin, [...new Set(normaliser(texte).split(' '))].join(' ')];
  });
  return Response.json(corps);
}
