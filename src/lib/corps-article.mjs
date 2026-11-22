// Corps d'un article tel qu'il est affiché. Le HTML du dépôt privé n'est pas
// réécrit : ces deux corrections s'appliquent à la construction.

// 1. Hiérarchie des titres. 244 anciens articles WordPress ouvrent leurs
//    intertitres en <h3> ou <h4> juste sous le <h1> de la page, parfois avant un
//    <h2> plus loin : des sauts de niveau que les lecteurs d'écran annoncent
//    comme des sections manquantes. Les titres sont renumérotés sans saut, le
//    premier en <h2>, en gardant qui est frère et qui est enfant de qui.
export function niveauxDeTitres(html) {
  // Pile des titres ouverts : [niveau d’origine, niveau affiché]. Deux titres
  // de même niveau d’origine restent frères ; un titre plus bas devient enfant.
  const pile = []; let ouvert = null;
  return html.replace(/<(\/?)h([1-6])\b/gi, (m, fin, n) => {
    if (fin) { const niveau = ouvert ?? Number(n); ouvert = null; return `</h${niveau}`; }
    const origine = Number(n);
    while (pile.length && pile[pile.length - 1][0] >= origine) pile.pop();
    const niveau = pile.length ? Math.min(6, pile[pile.length - 1][1] + 1) : 2;
    pile.push([origine, niveau]); ouvert = niveau;
    return `<h${niveau}`;
  });
}

// 2. Liens morts. Les articles anciens citent 50 000 pages de presse, dont la
//    moitié a disparu (7 sur 12 dans un échantillon de 2009-2011). On les
//    envoie vers la copie d'Internet Archive la plus proche de la date de
//    publication : la source telle qu'elle était quand on l'a citée.
export const ARCHIVER_AVANT = '2021-01-01';
const NOTRE_SITE = /^https?:\/\/([a-z0-9-]+\.)*intimeconviction\.fr(\/|$)/i;
const DEJA_ARCHIVE = /^https?:\/\/(web\.)?archive\.org\//i;

export function liensArchives(html, date) {
  const jour = new Date(date);
  if (Number.isNaN(jour.getTime()) || jour >= new Date(ARCHIVER_AVANT)) return html;
  const horodatage = jour.toISOString().slice(0, 10).replaceAll('-', '');
  return html.replace(/(<a\b[^>]*?\bhref=)(["'])(https?:\/\/[^"']+)\2/gi, (m, debut, q, url) => {
    if (NOTRE_SITE.test(url) || DEJA_ARCHIVE.test(url)) return m;
    return `${debut}${q}https://web.archive.org/web/${horodatage}/${url}${q}`;
  });
}

export function corpsAffiche(html, date) {
  return liensArchives(niveauxDeTitres(html ?? ''), date);
}
