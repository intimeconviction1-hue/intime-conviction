// Regroupement conservateur des références en accueil.
// Une même affaire peut produire plusieurs événements distincts : seuls des
// titres avec une identité complète et une étape judiciaire explicite se rejoignent.
const sansAccents = value => String(value ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

const EXCLUS = new Set([
  'cour assises', 'cour criminelle', 'cour appel', 'cour cassation',
  'le parisien', 'ouest france', 'france info', 'france bleu',
  'saint etienne', 'saint brieuc', 'aix provence', 'en france',
]);
const NOMS_COMMUNS = new Set([
  'proces', 'affaire', 'assassinat', 'meurtre', 'verdict', 'appel',
  'condamne', 'condamnee', 'accuse', 'accusee', 'avocat', 'avocate',
  'justice', 'audience', 'requisitions', 'cour', 'assises', 'crime',
  'homicide', 'police', 'paris', 'marseille', 'novembre', 'lundi',
  'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',
]);

function identites(titre) {
  const noms = new Set();
  // Noms propres à deux termes au minimum. Les patronymes seuls, villes et
  // libellés institutionnels sont insuffisants pour identifier une affaire.
  const matches = String(titre ?? '').matchAll(/\b([A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]+)[\s’-]+([A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]+)\b/gu);
  for (const m of matches) {
    const nomsNormalises = [sansAccents(m[1]), sansAccents(m[2])];
    const cle = nomsNormalises.join(' ');
    if (!EXCLUS.has(cle) && nomsNormalises.every(n => n.length > 2 && !NOMS_COMMUNS.has(n))) noms.add(cle);
  }
  return noms;
}

function evenement(titre) {
  const t = sansAccents(titre);
  // Il ne faut pas mélanger réquisitions, audience, verdict et décision
  // de cassation. Un titre sans événement identifiable n'est pas regroupé.
  if (/\b(cassation|pourvoi|casse|annulation)\b/.test(t)) return 'cassation';
  if (/\b(renvoi|reporte|reportee|ajourne|ajournee)\b/.test(t)) return 'renvoi';
  if (/\b(requisitions?|peine requise|reclame \d+ ans)\b/.test(t)) return 'requisitions';
  if (/\b(verdict|condamne|condamnee|condamnation|acquitte|acquittee|acquittement|reclusion)\b/.test(t))
    return /\b(en appel|proces en appel|verdict en appel)\b/.test(t) ? 'verdict-appel' : 'verdict';
  if (/\b(ouverture du proces|debut du proces|s ouvre|commence)\b/.test(t)) return 'ouverture';
  return null;
}

function jour(date) {
  const str = String(date ?? '').slice(0, 10);
  const ms = Date.parse(str + 'T12:00:00Z');
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Utilisé uniquement pour choisir les cartes d'accueil.
 * Ne retire rien du flux intégral ni des archives, ne réécrit aucun titre.
 * Doute sur le nom, la procédure ou la date : deux références restent visibles.
 */
export function regrouperPresseAccueil(references = []) {
  const conserves = [];
  const rencontres = [];
  for (const ref of references) {
    const noms = identites(ref.titre);
    const etape = evenement(ref.titre);
    const date = jour(ref.date);
    if (!noms.size || !etape || date === null) {
      conserves.push(ref);
      continue;
    }
    const doublon = rencontres.some(ancien =>
      ancien.etape === etape &&
      Math.abs(ancien.date - date) <= 2 * 86400000 &&
      [...noms].some(n => ancien.noms.has(n))
    );
    if (doublon) continue;
    conserves.push(ref);
    rencontres.push({ noms, etape, date });
  }
  return conserves;
}


// La vitrine de cinq cartes est plus sélective que la revue complète :
// une seule histoire par affaire, même si audience et verdict sont distincts.
// Les étapes restent disponibles dans la revue intégrale et les archives.
// Aliases limités à des affaires identifiables sans ambiguïté dans ce corpus.
const ALIAS_AFFAIRES = [
  ['zecler', /\bzecler\b/u],
  ['crepol', /\bcrepol\b/u],
  ['inass-touloub', /\b(?:inass|touloub|inconnue de l.a10|martyre de l.a10)\b/u],
  ['olivio-gomes', /\b(?:olivio gomes|olivio)\b/u],
  ['sollacaro', /\b(?:sollacaro|mickael ettori)\b/u],
  ['dominique-bernard', /\bdominique bernard\b/u],
  ['francis-heaulme', /\b(?:francis heaulme|jean.joseph clement)\b/u],
  ['madjaliwa-safari', /\bmadjaliwa safari\b/u],
];

function clesAffaire(titre) {
  const texte = sansAccents(titre).replace(/[’‘]/g, "'");
  const alias = ALIAS_AFFAIRES.filter(([,motif]) => motif.test(texte)).map(([cle]) => cle);
  // Un nom complet, présent dans les deux titres, est un indice suffisamment
  // précis. Un mot générique ou une simple ville ne doit jamais suffire.
  return new Set([...identites(titre), ...alias]);
}

/**
 * À appliquer APRÈS le classement éditorial : conserve pour chaque affaire
 * la référence la mieux classée et remplace les autres par de nouveaux sujets.
 * Sans identité certaine, la référence reste visible.
 */
export function diversifierAffairesAccueil(references = [], limite = 5) {
  if (!Number.isInteger(limite) || limite <= 0) return [];
  const deja = new Set();
  const selection = [];
  for (const reference of references) {
    const cles = clesAffaire(reference.titre);
    if ([...cles].some(cle => deja.has(cle))) continue;
    selection.push(reference);
    cles.forEach(cle => deja.add(cle));
    if (selection.length === limite) break;
  }
  return selection;
}
