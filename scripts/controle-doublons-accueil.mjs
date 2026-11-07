#!/usr/bin/env node
// Barrière éditoriale : l’accueil met en avant les articles du journal.
// Les articles externes demeurent consultables comme sources et dans les archives.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const html = await readFile(join(dist, 'index.html'), 'utf8');
const corps = html.split('<body')[1] ?? html;
const sectionsPresse = [
  'class="presse-section-intro"',
  'class="une-info-principale"',
  'class="une-defile"',
  'class="une-defile-carte"'
];
const presentes = sectionsPresse.filter(x => corps.includes(x));
if (presentes.length) {
  console.error('Accueil refusé : liens de presse mis en une :', presentes.join(', '));
  process.exitCode = 1;
} else if (!corps.includes('class="article-redaction-une"')) {
  console.error('Accueil refusé : aucune publication du journal mise en avant.');
  process.exitCode = 1;
} else {
  console.log('Accueil validé : la une présente les articles du journal, sans bloc de presse externe.');
}
