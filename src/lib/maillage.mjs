import { articleVisible } from './article-visible.mjs';
import { normaliserTitre } from './dossiers.mjs';

const sujets = [
  ['legitime-defense', /\blegitime defense\b/],
  ['premeditation', /\bpremeditation\b/],
  ['responsabilite', /\b(?:irresponsabilite penale|abolition du discernement|alteration du discernement)\b/],
  ['expertises', /\b(?:expertise psychiatrique|expertise balistique|preuve genetique|preuve adn|autopsie)\b/],
  ['jurys', /\b(?:jures populaires|tirage au sort des jures|jury populaire)\b/],
  ['criminelles', /\bcours? criminelles? departementales?\b/],
  ['recours', /\b(?:proces en appel|cour d assises d appel|pourvoi en cassation)\b/],
  ['requisitions', /\brequisitions\b/],
  ['plaidoiries', /\bplaidoiries?\b/],
  ['delibere', /\bdelibere\b/],
];
const piliers = new Map([
  ["cour d[’']assises", '/comprendre/#juridictions'],
  ['cour criminelle departementale', '/comprendre/#juridictions'],
  ['jurés populaires', '/comprendre/#jures'],
  ['pourvoi en cassation', '/jurisprudence/'],
]);
const duchere = new Set([
  'la-duchere-proces-guerre-sans-fiston',
  'duchere-lyon-proces-absence-ben-addi',
  'duchere-lyon-enregistrement-audience-paroles-sous-scelles',
]);
const annee = 365 * 86400000;

function fiche(article) {
  const d = article.data;
  const m = d.maillage ?? {};
  const texte = normaliserTitre(d.titre + ' ' + d.extrait);
  const champs = {
    affaire: m.affaire ?? (duchere.has(d.slug) ? 'duchere-fiston' : undefined),
    personne: m.personnes, juridiction: m.juridiction, territoire: m.territoire,
    qualification: m.qualifications, enjeu: [...(m.enjeux ?? []), ...sujets.filter(([, motif]) => motif.test(texte)).map(([s]) => s)],
    etape: m.etape, jurisprudence: m.jurisprudence,
  };
  return Object.entries(champs).flatMap(([type, valeurs]) =>
    [...new Set([valeurs].flat().filter(Boolean).map(normaliserTitre).filter(Boolean))].map(cle => [type, cle]));
}

const poids = { affaire: 100, personne: 34, juridiction: 25, territoire: 8, qualification: 13, enjeu: 28, etape: 5, jurisprudence: 38 };

export function indexerMaillage(articles, maintenant = Date.now()) {
  const publics = articles.filter(({data}) => articleVisible(data, maintenant));
  const chemins = new Map(publics.map(a => [a.data.chemin, a]));
  const fiches = new Map(publics.map(a => [a, fiche(a)]));
  const index = new Map();
  for (const [article, cles] of fiches) for (const [type, cle] of cles) {
    const id = type + ':' + cle;
    if (!index.has(id)) index.set(id, []);
    index.get(id).push(article);
  }

  return article => {
    if (!fiches.has(article)) return [];
    const d = article.data;
    const exclus = new Set([d.chemin, ...(d.maillage?.exclure ?? [])]);
    const scores = new Map();
    for (const [type, cle] of fiches.get(article)) {
      const groupe = index.get(type + ':' + cle);
      for (const autre of groupe) {
        if (exclus.has(autre.data.chemin)) continue;
        const score = scores.get(autre) ?? { total: 0, types: new Set() };
        score.total += poids[type];
        score.types.add(type);
        scores.set(autre, score);
      }
    }
    const tries = [...scores].filter(([, s]) => s.total >= 25).sort(([a, sa], [b, sb]) =>
      (sb.total + bonus(d, b.data)) - (sa.total + bonus(d, a.data)) ||
      b.data.date - a.data.date || a.data.chemin.localeCompare(b.data.chemin));
    const modules = [];
    let reste = 6;
    function ajouter(titre, candidats, limite) {
      const articles = [];
      for (const candidat of candidats) {
        if (articles.length >= limite || !reste) break;
        if (!candidat || exclus.has(candidat.data.chemin)) continue;
        articles.push(candidat);
        exclus.add(candidat.data.chemin);
        reste--;
      }
      if (articles.length) modules.push({ titre, articles, description: titre === 'Les affaires à rapprocher' ? 'Le rapprochement porte sur un enjeu documenté ; il ne signifie pas que les faits ou les personnes sont liés.' : undefined });
    }
    const selection = predicat => tries.filter(([a, s]) => predicat(a.data, s.types)).map(([a]) => a);
    ajouter('Les précédentes audiences', selection((a, t) => t.has('affaire') && a.date < d.date && a.maillage?.etape === 'audience'), 2);
    ajouter('Sur la même affaire', selection((_, t) => t.has('affaire')), 2);
    ajouter('Pour aller plus loin', (d.maillage?.recommander ?? []).map(c => chemins.get(c)), 2);
    ajouter('Comprendre les enjeux juridiques', selection((a, t) => (t.has('jurisprudence') || t.has('enjeu')) && ['le-banc-des-jures', 'l-expose'].includes(a.rubrique)), 2);
    ajouter('Dans cette juridiction', selection((_, t) => t.has('juridiction')), 1);
    ajouter('Dans nos archives', selection((a, t) => maintenant - a.date > annee && (t.has('enjeu') || t.has('jurisprudence'))), 2);
    ajouter('Les affaires à rapprocher', selection((a, t) => maintenant - a.date <= annee && (t.has('enjeu') || t.has('qualification') || t.has('personne'))), 2);
    return modules;
  };
}

function bonus(a, b) {
  return Math.max(0, 4 - Math.abs(a.date - b.date) / (30 * 86400000));
}

// Une seule ancre, dans un paragraphe sans balisage interne, avant les sources.
export function relierAuGuide(html) {
  let avantSources = true;
  let lie = false;
  return html.replace(/<h[2-6]\b[^>]*>\s*Sources\b|<p\b[^>]*>([^<]*)<\/p>/giu, (bloc, prose) => {
    if (prose === undefined) { avantSources = false; return bloc; }
    if (!avantSources || lie) return bloc;
    for (const [ancre, href] of piliers) {
      const expression = new RegExp('\\b' + ancre + '\\b', 'iu');
      if (html.includes('href="' + href + '"') || !expression.test(prose)) continue;
      lie = true;
      return bloc.replace(expression, texte => '<a href="' + href + '">' + texte + '</a>');
    }
    return bloc;
  });
}


/** Dédoublonne les illustrations sur toute la page et garde les mêmes choix au rendu. */
export function allouerVisuels(modules, photoPourArticle) {
  if (typeof photoPourArticle !== 'function') throw new TypeError('photoPourArticle est requis');
  const imagesUtilisees = new Set();
  return (modules ?? []).map(module => {
    const imagesExclues = [...imagesUtilisees];
    const articles = [];
    for (const article of module.articles ?? []) {
      const visuel = photoPourArticle(article.data, imagesUtilisees);
      const src = visuel?.image?.src;
      if (!src || imagesUtilisees.has(src)) continue;
      imagesUtilisees.add(src);
      articles.push(article);
    }
    return { ...module, articles, imagesExclues };
  }).filter(module => module.articles.length);
}
