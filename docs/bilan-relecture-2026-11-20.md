# Contrôle rédactionnel du 20 novembre 2026

Document technique interne. Ne pas afficher dans la navigation ou les pages destinées aux lecteurs.

## Périmètre
- 29 articles datés de 2026 présents dans le dépôt privé `intime-conviction-articles/articles/2026`.
- Archives historiques exclues de la réécriture automatique.
- Relecture des titres, des chapôs, des paragraphes où la provenance des sources interrompait le récit et des éventuelles actualisations empilées.
- Fondements : charte d'écriture judiciaire, six références dont Pascale Robert-Diard. Aucune scène d'audience inventée.

## Corrections éditoriales
- Refondus en récits continus après verdict : Inass Touloub, Olivio Gomes, Châteauneuf-les-Martigues, Caro, Ferreira.
- Restructuration du suivi Zecler pour distinguer les preuves, la défense, l'accusation et les réquisitions.
- Crépol : audience du 16 novembre tenue, arrêt annoncé pour le 18 décembre, sans préjuger de la décision.
- Attributions répétitives resserrées : Luca, Madjaliwa Safari, Manosque, Maylis Daubon, Lyanna, Saint-Junien, chronique transversale du 18 novembre.
- Lourdes : liens documentaires regroupés en section Sources.

## Contrôle automatisé
- `scripts/auditer-production.mjs` émet des alertes de relecture, sans réécriture forcée.
- `tests/alerte-ecriture.test.mjs` vérifie le comportement d'alerte et l'exclusion des archives.
- Les alertes sont heuristiques : leur absence ne garantit ni l'exactitude d'un fait ni la qualité littéraire.
- La publication du site doit toujours franchir `npm test`, la construction et les contrôles de contenu déjà en place.

## Vérification de diffusion
- Versions restructurées déjà confirmées publiquement par lecture directe des pages Inass, Olivio Gomes et Caro le 20 novembre.
- Les autres pages doivent être relues à nouveau après déploiement du présent commit.
- Une réussite de workflow ne garantit pas à elle seule l'actualisation de chaque cache du site.
