// Présentation des références extérieures : pas de réécriture de faits ni de titres.
// Le titre fourni par la source reste disponible en infobulle et en métadonnées.
export function presenterTitrePresse(titre, source) {
  const original = String(titre ?? '').replace(/\\s+/g, ' ').trim();
  const media = String(source ?? '').replace(/\\s+/g, ' ').trim();
  let lisible = original;
  // Certains relevés ajoutent à la fin le nom du média déjà affiché au-dessus.
  // Ne supprimer le suffixe que si le média est exactement identique.
  const tiret = lisible.lastIndexOf(' - ');
  if (tiret > 0 && media && lisible.slice(tiret + 3).toLocaleLowerCase('fr') === media.toLocaleLowerCase('fr')) {
    lisible = lisible.slice(0, tiret).trimEnd();
  }
  const abrege = /(?:\\.\\.\\.|…)\\s*$/.test(lisible);
  return { titre: lisible, original, abrege };
}
