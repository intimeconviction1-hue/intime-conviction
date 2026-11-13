import { tousLesArticles } from './articles.mjs';

export function signatureRedaction(auteur) {
  return /^rédaction d[’']intime conviction$/iu.test(auteur.trim());
}

export async function articlesADiffuser() {
  const maintenant = Date.now();
  const articles = await tousLesArticles();
  return articles.map(({ data }) => data).filter(article =>
    article.verificationEnCours !== true &&
    article.date.getTime() <= maintenant &&
    signatureRedaction(article.auteur)
  );
}

const entites = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

export function xml(texte) {
  return String(texte)
    .replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, '')
    .replace(/[&<>"']/g, caractere => entites[caractere]);
}
