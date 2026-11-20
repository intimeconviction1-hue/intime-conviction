// Références dont l'URL originale a été retrouvée et vérifiée.
// Ne jamais dériver une adresse de presse d'un titre par conjecture.
// La correspondance exige le nom du média ET deux fragments distinctifs.
export const liensPresseVerifies = Object.freeze([
  {
    source: 'Ouest-France',
    fragments: ['27 ans', 'essonne', '23 coups de couteau'],
    lien: 'https://www.ouest-france.fr/ile-de-france/evry-91000/jai-detruit-condamne-a-27-ans-de-prison-dans-lessonne-apres-avoir-tue-son-ex-compagne-de-23-coups-de-couteau-8745284e-e4e9-11f1-b9ed-164c427aef07'
  }
]);

const normaliser = texte => String(texte ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
  .replace(/[^a-z0-9]+/g, ' ').trim();

export function remplacerParLienDirectVerifie(reference) {
  if (!reference || typeof reference !== 'object') return reference;
  const source = normaliser(reference.source);
  const titre = normaliser(reference.titre);
  const trouve = liensPresseVerifies.find(regle =>
    source === normaliser(regle.source)
    && regle.fragments.every(fragment => titre.includes(normaliser(fragment)))
  );
  return trouve ? {...reference, lien: trouve.lien} : reference;
}
