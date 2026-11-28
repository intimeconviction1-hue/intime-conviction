import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const layout=readFileSync(fileURLToPath(new URL('../src/layouts/Base.astro',import.meta.url)),'utf8');
const menu=layout.slice(layout.indexOf('const navigation ='),layout.indexOf('const piedNavigation ='));
const header=layout.slice(layout.indexOf('<div class="bande-navigation">'),layout.indexOf('</header>'));

function categorie(nom){
  const debut=menu.indexOf("{ titre: '"+nom+"'");
  assert.notEqual(debut,-1,'Rubrique absente : '+nom);
  const fin=menu.indexOf("  ] },",debut);
  assert.notEqual(fin,-1,'Rubrique incomplète : '+nom);
  return menu.slice(debut,fin+6);
}

test('la revue de presse appartient à Actualité et non au bandeau autonome',()=>{
  const actualite=categorie('Actualité');
  assert.match(actualite,/titre:'Revue de presse',href:'\/revue-de-presse\/'/);
  assert.equal((menu.match(/href:\s*'\/revue-de-presse\/'/g)||[]).length,1);
  assert.doesNotMatch(header,/class="navigation-presse-menu"/);
  assert.doesNotMatch(header,/class="navigation-entree"[^>]*>\s*<a href="\/revue-de-presse\/" /);
});

test('Agenda regroupe sessions, procès au rôle, rôles, juridictions et visite',()=>{
  const agenda=categorie('Agenda');
  for(const href of [
    '/agenda/#sessions-annoncees','/agenda/#audiences-a-verifier',
    '/veille-roles/','/annuaire/#repertoire','/assister/'
  ])assert.ok(agenda.includes("href:'"+href+"'"),'Accès Agenda manquant : '+href);
  assert.doesNotMatch(header,/class="navigation-acces"/);
  assert.doesNotMatch(header,/>Infos pratiques\s*</);
});

test('les autres parcours restent accessibles sans changer les URL',()=>{
  assert.match(categorie('Dossiers'),/href:\s*'\/dossiers\/'/);
  assert.match(categorie('Comprendre'),/href:\s*'\/comprendre\/'/);
  assert.match(header,/href="\/rubrique\/le-greffe\/"/);
  assert.match(header,/href="\/agenda\/"/);
  assert.match(layout,/href:\s*'\/archives\/'/);
  assert.match(layout,/href:\s*'\/revue-de-presse\/'/);
});

test('Dossiers ne répète pas son lien principal et sépare analyse, chronologie et carte',()=>{
  const dossiers=categorie('Dossiers');
  assert.equal((dossiers.match(/href:\s*'\/dossiers\/'/g)||[]).length,1);
  assert.match(dossiers,/titre:'Analyses des affaires',href:'\/rubrique\/l-expose\/'/);
  assert.match(dossiers,/titre:'Chronologie des affaires',href:'\/chronologie\/'/);
  assert.match(dossiers,/titre:'Carte des affaires',href:'\/carte\/'/);
  assert.doesNotMatch(dossiers,/titre:'Archives judiciaires'/);
});

test('Comprendre distingue explications, débats et jurisprudence',()=>{
  const comprendre=categorie('Comprendre');
  assert.match(comprendre,/titre:'Les acteurs du procès',href:'\/rubrique\/le-banc-des-jures\/'/);
  assert.match(comprendre,/titre:'Débats sur la justice',href:'\/rubrique\/delibere\/'/);
  assert.match(comprendre,/titre:'Jurisprudence',href:'\/jurisprudence\/'/);
});

test('Culture est cohérent avec le titre de la page des vidéos',()=>{
  const videos=readFileSync(fileURLToPath(new URL('../src/pages/culture/videos.astro',import.meta.url)),'utf8');
  assert.match(header,/href="\/rubrique\/le-greffe\/">Livres, films et histoire/);
  assert.match(header,/href="\/culture\/videos\/">Documentaires et vidéos/);
  assert.match(videos,/<h1>Documentaires et vidéos<\/h1>/);
});

test('Archives regroupe les années, la presse ancienne et la recherche sans les déplacer',()=>{
  const archives=categorie('Archives');
  assert.match(archives,/href:\s*'\/archives\/'/);
  assert.match(archives,/titre:'Archives de presse',href:'\/archives\/presse\/'/);
  assert.match(archives,/titre:'Rechercher une affaire',href:'\/recherche\/'/);
  const archivesIndex=readFileSync(fileURLToPath(new URL('../src/pages/archives/index.astro',import.meta.url)),'utf8');
  assert.match(archivesIndex,/action="\/recherche\/"/);
  assert.match(archivesIndex,/name="q"/);
  assert.match(archivesIndex,/href={`\/archives\/\$\{an\}\/`}/);
  assert.match(archivesIndex,/href={`\/archives\/presse\/\$\{an\}\/`}/);
});

test('la recherche distingue les dossiers des articles datés et illustrés',()=>{
  const recherche=readFileSync(fileURLToPath(new URL('../src/pages/recherche.astro',import.meta.url)),'utf8');
  const index=readFileSync(fileURLToPath(new URL('../src/pages/index-recherche.json.js',import.meta.url)),'utf8');
  assert.match(recherche,/id="dossiers-recherche" class="resultats-fonds dossier-recherche"/);
  assert.match(recherche,/id="resultats-dossiers"/);
  assert.match(recherche,/id="resultats" class="role"/);
  assert.match(recherche,/new Intl.DateTimeFormat\('fr-FR'/);
  assert.match(recherche,/image\.className = 'photo-resultat'/);
  assert.match(index,/date: d\.date\.toISOString\(\)\.slice\(0,10\)/);
});
