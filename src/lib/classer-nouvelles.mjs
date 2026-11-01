// Ce tri concerne exclusivement les titres du fil de presse, jamais le fonds
// WordPress. Les noms et slugs viennent du système éditorial existant.
// On classe le GENRE du papier, pas le crime cité : « juré condamné » reste
// une affaire ; une citation d'accusé n'est pas une tribune d'opinion.
// Faute d'indice explicite dans le titre, la nouvelle reste dans Cours du Jour.
const normaliser = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');

export function classerNouvelle(titre) {
  const t = normaliser(titre);
  if (/^(?:tribune|opinion|editorial|point de vue)\s*[:—–-]/.test(t) || /\[(?:tribune|opinion|editorial)\]/.test(t)) return 'delibere';
  if (/^(?:cinema|livre|theatre|television|serie|documentaire)\s*:/.test(t)
    || /\b(?:un|son|le|nouveau) roman\b/.test(t)
    || /\b(?:film|documentaire|livre|serie) (?:sur|consacre|de proces)\b/.test(t)
    || /\b(?:critique litteraire|festival de cinema|sur les planches)\b/.test(t)) return 'le-greffe';
  if (/\b(?:role|selection|tirage au sort|recusation|designation|indemnisation|formation) (?:\w+ ){0,3}(?:jures|jure)\b/.test(t)
    || /\bcomment (?:fonctionne|devenir|etre|assister|se deroule)\b/.test(t)
    || /\b(?:regles du proces|fonctionnement de la cour|qu'est-ce qu'un jure|qui peut etre jure|presomption d'innocence expliquee)\b/.test(t)) return 'le-banc-des-jures';
  if (/\b(?:chronique d'audience|chroniques d'audience|recit d'audience|ambiance d'audience|dans les coulisses du proces|reportage au tribunal)\b/.test(t)) return 'la-cour-se-leve';
  if (/\b(?:decryptage|decrypter|analyse de|analyse du|analyse des|les chiffres de|que disent les chiffres|etude sur la justice|bilan de la justice)\b/.test(t)
    || /\b(?:pourquoi|comprendre)\b.*\b(?:reforme|justice criminelle|cours criminelles|cours d'assises)\b/.test(t)) return 'l-expose';
  return 'cours-du-jour';
}
