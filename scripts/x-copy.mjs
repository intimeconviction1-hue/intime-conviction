// Texte de publication fondé exclusivement sur les métadonnées de l'article.
// Les liens de suivi permettent d'identifier les visites provenant de X.
const SITE = 'https://www.intimeconviction.fr';

function raccourcir(texte, limite) {
  const propre = String(texte || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (propre.length <= limite) return propre;
  const morceau = propre.slice(0, limite - 1);
  const dernierEspace = morceau.lastIndexOf(' ');
  return (dernierEspace >= Math.floor(limite * 0.65) ? morceau.slice(0, dernierEspace) : morceau).trimEnd().replace(/[,:;.!?\s]+$/, '') + '…';
}

export function composeXPost(article) {
  if (!article?.title || !article?.url) throw new Error('Titre ou adresse de l’article absent.');
  const original = new URL(article.url);
  if (original.origin !== SITE) throw new Error('Adresse hors du domaine Intime Conviction.');
  const url = new URL(original);
  url.searchParams.set('utm_source', 'x');
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'articles_redaction');
  const titre = (article.isUpdate ? 'Mise à jour · ' : '') + raccourcir(article.title, article.isUpdate ? 99 : 112);
  const contexte = raccourcir(article.excerpt, 96);
  const publication = [titre, contexte && contexte.toLocaleLowerCase('fr') !== titre.toLocaleLowerCase('fr') ? contexte : '', url.href].filter(Boolean).join('\n\n');
  // X ramène les URL à 23 caractères environ, quelle que soit leur longueur réelle.
  const longueurX = publication.replace(/https?:\/\/[^\s]+/g, 'x'.repeat(23)).length;
  if (longueurX > 280) throw new Error('Texte trop long pour X : ' + longueurX);
  return publication;
}
