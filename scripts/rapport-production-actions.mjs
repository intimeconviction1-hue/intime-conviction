#!/usr/bin/env node
// Bilan non bloquant affiché dans GitHub Actions, jamais sur le site public.
import { readFile, appendFile } from 'node:fs/promises';

const fichier=process.env.IC_AUDIT_PRODUCTION_OUTPUT ?? 'audit-production/rapport.json';
try {
  const rapport=JSON.parse(await readFile(fichier,'utf8'));
  const aujourdHui=rapport.jours.find(j=>j.jourEnCours);
  if (!aujourdHui) throw new Error('Journée de Paris absente du rapport');
  const message=`Production rédactionnelle du ${aujourdHui.date} : ${aujourdHui.nombre}/${rapport.objectifQuotidien} articles déclarés ; ${aujourdHui.manque} à publier pour atteindre l’objectif (provisoire).`;
  console.log(message);
  if (aujourdHui.manque>0) {
    console.log(`::warning title=Objectif rédactionnel non atteint::${message}`);
  }
  if(process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY,
      `## Production éditoriale · ${aujourdHui.date}\n\n`+
      `**${aujourdHui.nombre} / ${rapport.objectifQuotidien}** articles originaux datés du jour dans le dépôt.\n\n`+
      `**Reste : ${aujourdHui.manque}.** ${aujourdHui.manque>0 ? 'Objectif en cours.' : 'Objectif atteint.'}\n\n`+
      'Ce bilan ne compte ni la revue de presse, ni les publications sur les réseaux, ni les mises à jour des anciens articles. Il ne confirme pas à lui seul les URL publiques.\n');
  }
} catch(e) {
  console.error('Impossible de produire le bilan quotidien : '+e.message);
  process.exitCode=1;
}
