// Recherche 100 % locale : aucune requête envoyée à un service tiers.
// Le titre et la phrase exacte priment sur les occurrences dans les extraits.
export function normaliser(valeur = '') {
  return String(valeur)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function preparerIndex(articles) {
  return articles.map((a, ordre) => ({
    ...a,
    ordre,
    titreRecherche: normaliser(a.titre),
    extraitRecherche: normaliser(a.extrait),
  }));
}

export function filtrerEtClasser(index, { q = '', rubrique = '', annee = '' } = {}) {
  const phrase = normaliser(q);
  const mots = [...new Set(phrase.split(' ').filter(Boolean))];
  const resultats = [];
  for (const a of index) {
    if (rubrique && a.rubrique !== rubrique) continue;
    if (annee && String(a.annee) !== String(annee)) continue;
    if (!mots.length) {
      resultats.push({ article: a, score: 0 });
      continue;
    }
    const titre = a.titreRecherche;
    const extrait = a.extraitRecherche;
    if (!mots.every((mot) => titre.includes(mot) || extrait.includes(mot))) continue;
    let score = 0;
    if (titre === phrase) score += 500;
    else if (titre.includes(phrase)) score += 150;
    else if (extrait.includes(phrase)) score += 22;
    for (const mot of mots) {
      if ((' ' + titre + ' ').includes(' ' + mot + ' ')) score += 36;
      else if (titre.includes(mot)) score += 18;
      if ((' ' + extrait + ' ').includes(' ' + mot + ' ')) score += 6;
      else if (extrait.includes(mot)) score += 2;
    }
    resultats.push({ article: a, score });
  }
  if (mots.length) resultats.sort((a, b) => b.score - a.score || a.article.ordre - b.article.ordre);
  return resultats.map((r) => r.article);
}

const normaliserPresse = texte => texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

export function filtrerPresse(references, {q = '', annee = ''} = {}) {
  const phrase = normaliserPresse(q.trim());
  if (phrase.length < 2) return [];
  const mots = phrase.split(/\s+/);
  return references.filter(([titre, media, , date]) => {
    if (annee && !date.startsWith(annee)) return false;
    const texte = normaliserPresse(titre + ' ' + media);
    return mots.every(mot => texte.includes(mot));
  });
}

let indexPresse;
export function chargerIndexPresse() {
  indexPresse ??= fetch('/archives/presse/index-recherche.json').then(async reponse => {
    if (!reponse.ok) throw new Error('Index presse indisponible');
    const {articles} = await reponse.json();
    if (!Array.isArray(articles)) throw new Error('Index presse invalide');
    return articles.filter(reference => Array.isArray(reference) && reference.length === 4 &&
      reference.every(champ => typeof champ === 'string') && /^https?:\/\//i.test(reference[2]));
  }).catch(erreur => {
    indexPresse = undefined;
    throw erreur;
  });
  return indexPresse;
}
