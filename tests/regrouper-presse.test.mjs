import test from 'node:test';
import assert from 'node:assert/strict';
import { regrouperPresseAccueil, diversifierAffairesAccueil } from '../src/lib/regrouper-presse.mjs';

const ref = (titre, date = '2026-11-18') => ({ titre, date, lien: 'https://example.org/' + encodeURIComponent(titre) });

test('deux sources sur le même verdict nommé donnent une seule carte', () => {
  const a = ref('Olivio Gomes condamné à huit ans de réclusion');
  const b = ref('Verdict : Olivio Gomes condamné en cour d’assises');
  const c = ref('Antoine Sollacaro : verdict aux assises');
  assert.deepEqual(regrouperPresseAccueil([a,b,c]), [a,c]);
});

test('des étapes différentes du même procès sont conservées', () => {
  const a = ref('Olivio Gomes : réquisitions du parquet');
  const b = ref('Olivio Gomes condamné : verdict rendu');
  const c = ref('Olivio Gomes : pourvoi en cassation');
  const d = ref('Olivio Gomes : audience reportée');
  assert.deepEqual(regrouperPresseAccueil([a,b,c,d]), [a,b,c,d]);
});

test('une décision en appel reste distincte du verdict non qualifié', () => {
  const a = ref('Olivio Gomes condamné : verdict');
  const b = ref('Olivio Gomes condamné en appel');
  assert.deepEqual(regrouperPresseAccueil([a,b]), [a,b]);
});

test('les dates éloignées sont préservées', () => {
  const a = ref('Antoine Sollacaro : verdict prononcé', '2026-11-10');
  const b = ref('Antoine Sollacaro : verdict prononcé', '2026-11-18');
  assert.deepEqual(regrouperPresseAccueil([a,b]), [a,b]);
});

test('aucune fusion sans nom complet ou sans événement explicite', () => {
  const a = ref('Verdict de la cour d’assises à Paris');
  const b = ref('Verdict de la cour d’assises à Paris');
  const c = ref('Olivio Gomes : les témoignages du procès');
  const d = ref('Olivio Gomes : les témoignages du procès');
  assert.deepEqual(regrouperPresseAccueil([a,b,c,d]), [a,b,c,d]);
});

test('ne modifie ni les références ni leur ordre', () => {
  const items = [ref('Verdict : Olivio Gomes condamné'), ref('Verdict : Olivio Gomes condamné')];
  assert.equal(regrouperPresseAccueil(items)[0], items[0]);
  assert.equal(items.length, 2);
});

test('la vitrine ne montre pas deux fois la même affaire avec des étapes différentes', () => {
  const items = [
    ref('Procès Michel Zecler : audience du matin'),
    ref('Procès Zecler : réquisitions du parquet'),
    ref('Affaire Olivio Gomes : verdict en appel'),
    ref('Un autre procès sans identité certaine'),
  ];
  assert.deepEqual(diversifierAffairesAccueil(items, 3), [items[0],items[2],items[3]]);
  assert.equal(items.length, 4);
});

test('après sélection, une carte redondante laisse place à une autre affaire', () => {
  const items = [
    ref('Antoine Sollacaro : ouverture des débats'),
    ref('Affaire Sollacaro : de nouveaux témoins'),
    ref('Mickaël Ettori : réquisitions'),
    ref('Procès Michel Zecler : audience'),
    ref('Madjaliwa Safari : ouverture du procès'),
  ];
  assert.deepEqual(diversifierAffairesAccueil(items, 3), [items[0],items[3],items[4]]);
});

test('aucune fusion sur un terme judiciaire générique ou une ville seule', () => {
  const items = [ref('Verdict à Paris'),ref('Ouverture des assises de Paris'),ref('Audience sur un meurtre')];
  assert.deepEqual(diversifierAffairesAccueil(items, 5), items);
  assert.deepEqual(diversifierAffairesAccueil(items, 0), []);
});

test('la vitrine garde un seul sujet pour Mathy, Sadani et Karen Baldi', () => {
  const items=[
    ref('Brandon Mathy accusé aux assises de Liège'),
    ref('Le meurtre d’Orlan Mélon devant les jurés'),
    ref('Sarah Sadani : les témoins sont entendus'),
    ref('Au procès du meurtre de Sarah Sadani, ouverture des débats'),
    ref('Procès de la policière Karen à Nice'),
    ref('Karen Baldi : son assassin devant la cour')
  ];
  assert.deepEqual(diversifierAffairesAccueil(items, 5),[items[0],items[2],items[4]]);
});
