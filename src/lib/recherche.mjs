// Recherche 100 % locale : aucune requête envoyée à un service tiers.
// Le titre et la phrase exacte priment sur les occurrences dans les extraits.
export function normaliser(valeur = '') {
  return String(valeur)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function preparerIndex(articles) {
  // Une même URL publiée ne doit jamais occuper deux emplacements
  // dans les résultats. On conserve sa première occurrence, donc
  // son ordre éditorial original.
  const chemins = new Set();
  return articles.filter(article => {
    if (!article || typeof article.chemin !== 'string' || !article.chemin.startsWith('/')) return false;
    if (chemins.has(article.chemin)) return false;
    chemins.add(article.chemin);
    return true;
  }).map((a, ordre) => ({
    ...a,
    ordre,
    titreRecherche: normaliser(a.titre),
    extraitRecherche: normaliser(a.extrait),
  }));
}

const motsCourants = new Set(['a', 'au', 'aux', 'd', 'de', 'des', 'du', 'l', 'la', 'le', 'les', 'un', 'une', 'affaire']);
const contientMot = (texte, mot) => ` ${texte} `.includes(` ${mot} `);

function uneFaute(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length > b.length) return a.slice(i + 1) === b.slice(i);
  if (b.length > a.length) return a.slice(i) === b.slice(i + 1);
  return a.slice(i + 1) === b.slice(i + 1) ||
    (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
}

export function chercherArticles(index, { q = '', rubrique = '', annee = '' } = {}, corps = new Map()) {
  const phrase = normaliser(q);
  const termes = [...new Set(phrase.split(' ').filter(Boolean))];
  const principaux = termes.filter(mot => !motsCourants.has(mot));
  const mots = principaux.length ? principaux : termes;
  const candidats = index.filter(a => (!rubrique || a.rubrique === rubrique) &&
    (!annee || String(a.annee) === String(annee)));
  if (!mots.length) return { articles: candidats, approximatif: false };

  const exacts = [];
  for (const article of candidats) {
    const titre = article.titreRecherche, extrait = article.extraitRecherche;
    let score = 0, trouve = true;
    for (const mot of mots) {
      if (contientMot(titre, mot)) score += 36;
      else if (contientMot(extrait, mot)) score += 10;
      else if (contientMot(corps.get(article.chemin) ?? '', mot)) score += 2;
      else { trouve = false; break; }
    }
    if (!trouve) continue;
    if (titre === phrase) score += 500;
    else if (contientMot(titre, phrase)) score += 150;
    exacts.push({ article, score });
  }

  const classer = resultats => resultats
    .sort((a, b) => b.score - a.score || b.article.annee - a.article.annee || a.article.ordre - b.article.ordre)
    .map(({ article }) => article);
  if (exacts.length) return { articles: classer(exacts), approximatif: false };

  const approches = [];
  for (const article of candidats) {
    const vocabulaire = article.titreRecherche.split(' ');
    const exact = mots.filter(mot => vocabulaire.includes(mot)).length;
    if (exact < mots.length - 1) continue;
    const absent = mots.find(mot => !vocabulaire.includes(mot));
    if (!absent || absent.length < 3) continue;
    if (absent.length >= 4 && vocabulaire.some(mot => uneFaute(absent, mot))) {
      approches.push({ article, score: 2 });
    } else if (vocabulaire.some(mot => mot.startsWith(absent))) {
      approches.push({ article, score: 1 });
    }
  }
  const meilleur = Math.max(0, ...approches.map(({ score }) => score));
  return { articles: classer(approches.filter(({ score }) => score === meilleur)), approximatif: meilleur > 0 };
}

export function filtrerEtClasser(index, options) {
  return chercherArticles(index, options).articles;
}

const normaliserPresse = texte => texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

export function filtrerPresse(references, {q = '', annee = ''} = {}) {
  const phrase = normaliserPresse(q.trim());
  if (phrase.length < 2) return [];
  const mots = phrase.split(/\s+/);
  const urls = new Set();
  return references.filter(([titre, media, url, date]) => {
    if (annee && !date.startsWith(annee)) return false;
    const texte = normaliserPresse(titre + ' ' + media);
    if (!mots.every(mot => texte.includes(mot))) return false;
    if (urls.has(url)) return false;
    urls.add(url);
    return true;
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
