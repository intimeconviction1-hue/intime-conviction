/**
 * Importe la photothèque optimisée d'INTIME CONVICTION.
 *
 * Usage : npm run phototheque:import -- /chemin/intime_conviction_phototheque_complete.zip
 * Dépose 516 images WebP dans public/phototheque/ et un inventaire JSON.
 * N'attribue jamais une photographie à un procès sans validation éditoriale.
 */
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, copyFile, mkdir, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const archive = process.argv[2];
if (!archive) {
  console.error('Usage : npm run phototheque:import -- <archive.zip>');
  process.exit(2);
}
const racine = resolve('public/phototheque');
const temp = await mkdtemp(join(tmpdir(), 'ic-phototheque-'));
try {
  execFileSync('unzip', ['-q', resolve(archive), '-d', temp], { stdio: 'inherit' });
  const inventaire = JSON.parse(await readFile(join(temp, 'inventaire.json'), 'utf8'));
  const uniques = inventaire.images.filter((item) => item.statut === 'unique');
  const noms = new Set();
  for (const item of uniques) {
    if (!/^[a-z0-9._-]+\.webp$/i.test(item.image) || item.image !== basename(item.image))
      throw new Error('Nom de fichier invalide dans le catalogue : ' + item.image);
    if (noms.has(item.image)) throw new Error('Image dupliquée dans le catalogue : ' + item.image);
    noms.add(item.image);
    await stat(join(temp, 'images', item.image));
  }
  if (uniques.length !== 516) throw new Error('Inventaire inattendu : ' + uniques.length + ' images au lieu de 516');
  await mkdir(racine, { recursive: true });
  for (const item of uniques) await copyFile(join(temp, 'images', item.image), join(racine, item.image));
  const exportables = uniques.map(({image, original, categorie, sha256, usage_recommande, legende_requise}) => ({
    src: '/phototheque/' + image, original, categorie, sha256, usage_recommande, legende_requise
  }));
  await writeFile(join(racine, 'catalogue.json'), JSON.stringify({ total: exportables.length, images: exportables }, null, 2) + '\n');
  console.log('Photothèque intégrée : ' + exportables.length + ' illustrations dans ' + racine);
} finally {
  await rm(temp, { recursive: true, force: true });
}
