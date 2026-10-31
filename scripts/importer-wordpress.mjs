// Transforme un export WordPress (XML) en un fichier JSON par article.
//
//   node scripts/importer-wordpress.mjs <export.xml> [dossier-de-sortie]
//
// Le dossier de sortie est par défaut ../intime-conviction-articles/articles :
// c'est le dépôt PRIVÉ. Les articles nomment des accusés, parfois acquittés ;
// dans ce dépôt public, un article retiré resterait lisible pour toujours dans
// l'historique git, et une demande de droit à l'oubli ne pourrait pas être
// honorée. Le code est public, le contenu ne l'est pas.
//
// Ce qui n'est JAMAIS copié : les commentaires (906 dans l'export du
// 29/07/2026) et les adresses e-mail, des auteurs comme des lecteurs.
//
// Le XML n'est pas bien formé (un caractère invalide à la ligne 28 037 de
// l'export du 29/07) : un parseur strict refuse tout le fichier. On lit donc
// les <item> un par un, ce qui laisse passer un article abîmé sans perdre les
// 3 505 autres.

import { readFileSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { rubriqueDe, ANCIENNES_CATEGORIES } from '../src/lib/rubriques.mjs';

const [, , source, sortieArg] = process.argv;
if (!source) {
  console.error('Usage : node scripts/importer-wordpress.mjs <export.xml> [dossier-de-sortie]');
  process.exit(1);
}
const sortie = resolve(sortieArg ?? '../intime-conviction-articles/articles');

const xml = readFileSync(source, 'utf8');

function champ(tag, bloc) {
  const debut = bloc.indexOf(`<${tag}>`);
  if (debut === -1) return '';
  const fin = bloc.indexOf(`</${tag}>`, debut);
  let v = bloc.slice(debut + tag.length + 2, fin);
  if (v.startsWith('<![CDATA[')) v = v.slice(9, v.lastIndexOf(']]>'));
  return v;
}

const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç' };
export function decoder(s) {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITES[e.toLowerCase()] ?? m;
  });
}

function texteSeul(html) {
  return decoder(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// Balises gardées. Tout le reste est « déballé » : la balise part, son texte
// reste — un <span> ou un <font> de Word ne doit pas emporter la phrase.
const GARDEES = new Set(['p', 'br', 'a', 'strong', 'b', 'em', 'i', 'u', 'blockquote', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'sup', 'sub', 'cite', 'hr', 'figure', 'figcaption']);
// Balises supprimées AVEC leur contenu. Les images et vidéos pointent toutes
// vers le site suspendu ou vers des lecteurs disparus depuis 2009 : une image
// cassée est pire qu'une image absente.
const SUPPRIMEES = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'xml', 'noscript', 'select', 'textarea', 'button', 'video', 'audio'];
const VIDES_SUPPRIMEES = ['img', 'input', 'param', 'link', 'meta', 'source'];
const BLOCS = /^<(p|h[2-4]|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|hr|figure)\b/i;

const ANCIEN_DOMAINE = /^https?:\/\/(www\.)?intimeconviction\.fr/i;

function nettoyer(html, stats) {
  let h = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const t of SUPPRIMEES) h = h.replace(new RegExp(`<${t}\\b[\\s\\S]*?</${t}\\s*>`, 'gi'), '');
  for (const t of VIDES_SUPPRIMEES) {
    h = h.replace(new RegExp(`<${t}\\b[^>]*>`, 'gi'), () => {
      if (t === 'img') stats.images++;
      return '';
    });
  }

  // Shortcodes des vidéos : un lien vaut mieux qu'un lecteur mort.
  h = h.replace(/\[(youtube|dailymotion)[^\]]*?(https?:\/\/[^\s\]]+)[^\]]*\]/gi, '<a href="$2">Voir la vidéo</a>');
  h = h.replace(/\[\/?(caption|youtube|dailymotion|embed|gallery)[^\]]*\]/gi, '');

  h = h.replace(/<\/?([a-zA-Z0-9]+)\b([^>]*)>/g, (m, tag, attrs) => {
    let t = tag.toLowerCase();
    const fermante = m[1] === '/';
    if (t === 'h1') t = 'h2';
    if (!GARDEES.has(t)) return t === 'div' ? '\n\n' : '';
    if (fermante) return `</${t}>`;
    if (t === 'a') {
      let href = decoder(attrs.match(/href\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? '');
      // Les alertes Google enveloppent chaque lien dans une redirection — `q=`
      // en 2009, `url=` en 2020-2021 : on rend l'adresse de l'article lui-même.
      const google = href.match(/^https?:\/\/www\.google\.[a-z.]+\/url\?(?:.*?&)?(?:url|q)=(https?[^&]+)/i);
      if (google) {
        // Une adresse mal encodée dans l'alerte ne doit pas arrêter l'import.
        try { href = decodeURIComponent(google[1]); } catch { href = google[1]; }
      }
      // Une image (« zoom ») ou un pixel de suivi d'un journal n'est pas une
      // lecture : le lien part, son texte reste.
      const versImage = /\.(gif|jpe?g|png|webp)(\?|$)|get\.aspx\?iMedia|memorix\.sdv\.fr/i.test(href);
      if (/^\s*(javascript|data):/i.test(href) || /\/wp-content\/uploads\//i.test(href) || !href || versImage) return '<a>';
      if (ANCIEN_DOMAINE.test(href)) {
        const chemin = href.replace(ANCIEN_DOMAINE, '') || '/';
        return `<a href="${chemin}">`;
      }
      return `<a href="${href.replace(/"/g, '&quot;')}" rel="nofollow noopener">`;
    }
    return t === 'br' || t === 'hr' ? `<${t}>` : `<${t}>`;
  });
  // Un lien sans adresse (image d'upload, javascript) devient du texte.
  h = h.replace(/<a>([\s\S]*?)<\/a>/g, '$1');

  // L'ancien WordPress écrivait les paragraphes par lignes vides (wpautop) :
  // sans cette étape, deux mille articles de 2009 tiendraient en un bloc.
  h = h
    .split(/\n\s*\n/)
    .map((morceau) => morceau.trim())
    .filter(Boolean)
    .map((morceau) => (BLOCS.test(morceau) ? morceau : `<p>${morceau.replace(/\n/g, '<br>')}</p>`))
    .join('\n');

  // Une feuille de style Word collée comme du texte (« mso-font-charset… ») :
  // aucune phrase d'article ne contient « mso- », le paragraphe part entier.
  h = h.replace(/<p>[^]*?<\/p>/g, (p) => (/mso-|MsoNormal|panose-1/.test(p) ? '' : p));
  h = h.replace(/<p>\s*zoom\s*<\/p>/gi, '');

  for (let i = 0; i < 3; i++) {
    h = h.replace(/<a [^>]*>(\s|&nbsp;|<br>)*<\/a>/gi, '');
    h = h.replace(/<(p|strong|em|b|i|u|li|h[2-4])>(\s|&nbsp;|<br>)*<\/\1>/gi, '');
  }
  return h.trim();
}

const auteurs = {};
for (const bloc of xml.match(/<wp:author>[\s\S]*?<\/wp:author>/g) ?? []) {
  auteurs[champ('wp:author_login', bloc)] = decoder(champ('wp:author_display_name', bloc));
}

const items = xml.split('<item>').slice(1).map((s) => s.slice(0, s.indexOf('</item>')));
const stats = { articles: 0, vides: 0, images: 0, categoriesInconnues: {} };
const parRubrique = {};

if (existsSync(sortie)) rmSync(sortie, { recursive: true });
mkdirSync(sortie, { recursive: true });

for (const bloc of items) {
  if (champ('wp:post_type', bloc) !== 'post' || champ('wp:status', bloc) !== 'publish') continue;

  const categories = [...bloc.matchAll(/<category domain="category" nicename="[^"]*"><!\[CDATA\[(.*?)\]\]><\/category>/g)].map((m) => decoder(m[1]));
  for (const c of categories) if (!(c in ANCIENNES_CATEGORIES)) stats.categoriesInconnues[c] = (stats.categoriesInconnues[c] ?? 0) + 1;

  const html = nettoyer(champ('content:encoded', bloc), stats);
  const texte = texteSeul(html);
  // 44 articles de l'export ne contenaient qu'un lecteur vidéo ou rien : une
  // page sans texte n'est pas publiée.
  if (texte.length < 40) {
    stats.vides++;
    continue;
  }

  const slug = champ('wp:post_name', bloc);
  const date = champ('wp:post_date', bloc).replace(' ', 'T');
  const [annee, mois] = date.split('-');
  const rubrique = rubriqueDe(categories);
  const article = {
    titre: texteSeul(champ('title', bloc)) || 'Sans titre',
    slug,
    date,
    // L'adresse de l'ancien site, à l'identique : les liens déjà partagés et
    // ce que Google connaît continuent de mener au bon article.
    chemin: `/${slug}/${mois}/${annee}/`,
    rubrique,
    anciennesCategories: categories,
    auteur: auteurs[champ('dc:creator', bloc)] ?? '',
    extrait: texte.length > 220 ? texte.slice(0, texte.lastIndexOf(' ', 220)) + '…' : texte,
    mots: texte.split(' ').length,
    html,
  };

  mkdirSync(join(sortie, annee), { recursive: true });
  writeFileSync(join(sortie, annee, `${slug}.json`), JSON.stringify(article, null, 1) + '\n');
  stats.articles++;
  parRubrique[rubrique] = (parRubrique[rubrique] ?? 0) + 1;
}

console.log(`${stats.articles} articles écrits dans ${sortie}`);
console.log(`${stats.vides} écartés faute de texte, ${stats.images} images retirées`);
console.log('Par rubrique :', parRubrique);
if (Object.keys(stats.categoriesInconnues).length) {
  // Une catégorie absente de la correspondance tombe dans Cours du Jour sans
  // bruit : on le DIT, sinon elle disparaîtrait dans le fourre-tout.
  console.log('⚠️ Catégories sans correspondance :', stats.categoriesInconnues);
}
