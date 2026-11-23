// Les mots-clés sont établis par la rédaction, dans les métadonnées de
// l'article original. Pas de rapprochement automatique par simple vocabulaire.
const normaliser = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr').replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9]+/g, ' ').trim();

const referencesParArticle = {
  '/samia-mimoun-maurepas-legitime-defense-verdict/11/2026/': [
    'GJ2QSSLEQNDLPIRVKCWLY2HJXI', 'PMUFYGSGGBFGLFYCVFWZ2SPTUA',
    'WCPB5OXDJNGZNBYIG2T5TEX4SE', 'UQYASSHSZVACJLVFBXKEEJ56RE',
    'CBMiiwFBVV95cUxQelVZenJZWFZEa1Z2TzRmOEluZE5xZ2x1QjVmaVdfcDJPbWpGbEkxN3VXeGhkSDFfRFdRRUxtc3ZJRW1yWFB4WkpnT2NNM2g1cFFvYlo5MFVPY0xJZnRaOEVvRTRvNHRabEtOYnlEU2R4cG1SeTFub1hPeXZhc2taMG5TOEN4ZXZpTkxZ',
  ],
  '/piaget-le-braqueur-au-borsalino-revient-devant-les-assises/11/2026/': [
    '2846782', 'TYNURC4T25HVXLJ2B5BGT6Y7AQ',
    '/braquage-de-la-joaillerie-piaget-en-2023-l-homme-au-borsalino-condamne-a-15-ans-de-reclusion',
  ],
  '/yordan-arron-basse-terre-desistement-appel/11/2026/': [
    '/Assises-de-Basse-Terre-Yordan-Arron-se-desiste-de-son-appel',
    '/Assises-en-appel-Yordan-Arron-rejuge-pour-la-mort-de-son-nourrisson',
  ],
  '/karen-baldi-proces-chambery-protection-premeditation/11/2026/': [
    '3452391.html', '2846785', '10762754',
  ],
  '/camille-paul-basse-terre-enregistrement-verdict/11/2026/': [
    '/meurtre-d-une-strasbourgeoise-en-2024-30-ans-de-reclusion',
    '/Pascal-Velayoudom-reconnu-coupable-du-viol-et-du-meurtre-de-Camille-Paul',
  ],
  '/duchere-lyon-proces-absence-ben-addi/11/2026/': [
    '65053768.html', '/article/154937/',
    '2846748', '2846764', 'VN-202611230268.html',
    'CBMixgFBVV95cUxPZHhBVFhTblNNWFlDYWw3QlFpdTAxeFVjMTg4Mm55',
    'CBMiygJBVV95cUxOQTJhckc0NjhaYldWWF8ycm5fMzdidWdPU0g3TFFM',
    'CBMiyAFBVV95cUxNbVJ0bWJLU0U2RFZUcFZYWXNqSFhwWTlBVkZGZm9q',
  ],
  '/jean-paul-benjamin-bobigny-images-legitime-defense/11/2026/': [
    'W4ZBVATMNNB5ROGARNH62RUAAU',
    '65UFEFWRAJBM3FZOS23TFSTTPU',
    'E2T22M2CDVFENHCL3WTSCAROVA',
    'afa1165b1b31a30482433d932af75f3b',
  ],
  '/evry-meurtre-sabine-appel-au-17/11/2026/': ['8745284e-e4e9-11f1-b9ed-164c427aef07'],
  '/nahel-merzouk-versailles-intention-du-tir/11/2026/': [
    'justice-se-prononcera-mardi-10766331',
    '225080659812914/mort-de-nahel',
    'renvoi-du-policier-pour-meurtre-13665529.php',
  ],
};

export function presseSansRedite(references, articlesEnUne) {
  const sujets = [...new Set(articlesEnUne.flatMap(article =>
    Array.isArray(article?.data?.sujetsPresse) ? article.data.sujetsPresse : []
  ).map(normaliser).filter(s => s.length >= 5))];
  const identifiants = articlesEnUne.flatMap(article => referencesParArticle[article?.data?.chemin] ?? []);
  if (!sujets.length && !identifiants.length) return references;
  return references.filter(reference => {
    if (identifiants.some(id => String(reference.lien ?? '').includes(id))) return false;
    const titre = ' ' + normaliser(reference.titre) + ' ';
    return !sujets.some(sujet => titre.includes(' ' + sujet + ' '));
  });
}
