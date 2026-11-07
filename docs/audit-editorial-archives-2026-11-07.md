# Intime Conviction — Contrôle documentaire des archives
Date du contrôle : 7 novembre 2026.

## Périmètre et limites
La liste du dépôt privé `intime-conviction-articles` contient 3 436 fichiers JSON sous `articles/`. Un échantillon de quinze articles a été lu individuellement, en conservant leur titre, date, URL, signature, extrait et début du corps de texte. Ce contrôle n'est ni une vérification complète de la provenance ni une qualification juridique.

## Répartition vérifiée des fichiers
- 2009 : 2 054
- 2010 : 522
- 2011 : 103
- 2012 : 124
- 2013 : 69
- 2014 : 86
- 2015 : 106
- 2016 : 52
- 2017 : 120
- 2018 : 65
- 2019 : 32
- 2020 : 45
- 2021 : 21
- 2022 : 3
- 2023 : 6
- 2025 : 5
- Autres années antérieures à 2009 : 23

Ces chiffres représentent des fichiers de la collection « articles » et non la revue de presse. L'année 2024 n'a pas de fichier d'article dans cette collection.

## Cas confirmés nécessitant une revue éditoriale
1. `articles/2009/15-ans-de-prison-au-pirate-des-caraibes.json` : ouverture sur la mention « AFP », mais champ `auteur` renseigné « Intime Conviction ». Vérifier la provenance et la présentation des crédits.
2. `articles/2009/14-ans-de-prison-pour-avoir-etrangle-un-camarade-de-lycee.json` : mention « NOUVELOBS.COM » et lien extérieur en tête du contenu, avec signature générique dans les métadonnées. Vérifier l'attribution.
3. `articles/2009/17-ans-de-reclusion-pour-le-predateur-sexuel.json` : mention « CLICANOO.COM » au début du texte, avec signature générique. Vérifier l'origine.
4. `articles/2017/12-hommes-en-colere-theatre-hebertot-jusquau-7-janvier-2018.json` : lien source vers Dalloz Actualité et mention « SOURCE » dans le corps. La signature générique demande une vérification.
5. `articles/2017/13329-2.json` : titre « Les peines de la semaine », 74 mots, plusieurs liens extérieurs. Il peut s'agir d'un format de veille, à distinguer d'un article rédigé.
6. `articles/2017/13366-2.json` : titre « Les décisions de la semaine », 43 mots et lien extérieur. Même vigilance sur la nature éditoriale.
7. `articles/2025/cours-du-jour-17-janvier-2025.json` : le corps démarre par un fragment de phrase (« meurtre de son grand-père… »), à contrôler pour une éventuelle troncature à l'import.
8. `articles/2025/cours-du-jour-6-janvier-2025.json` : titre daté et compilation de références extérieures. Vérifier le balisage des sources.
9. `articles/2025/tour-de-france-2024.json` : titre trop général au regard du sujet effectivement traité, mais ne pas modifier sans validation éditoriale.

## Décisions conservatoires
- Aucune modification des textes, des dates, des auteurs, des URL, des citations et des décisions judiciaires.
- Ne pas transformer les signaux automatiques de provenance en affirmation de plagiat ou d'erreur.
- Ne pas modifier les titres historiques sans étude du contenu et stratégie de préservation des URL.
- Distinguer les articles originaux, les compilations de liens et les références externes après vérification humaine.
- Conserver la présomption d'innocence et la temporalité des décisions et recours.


## Exécution exhaustive du 7 novembre 2026

Exécution GitHub Actions : [Publier le site, run 42406490377](https://github.com/intimeconviction1-hue/intime-conviction/actions/runs/42406490377), étape « Auditer les archives sans les modifier » réussie. Un artefact `audit-documentaire-archives` contient le détail des signalements.

- Articles analysés : **3 436**.
- Erreurs structurelles détectées par les règles actuellement programmées : **0**.
- Signalements non bloquants : **1 506**, susceptibles de concerner plusieurs fois un même article.
- Contenus inférieurs à 100 mots : **513**.
- Mentions de sources extérieures à l'ouverture : **368**.
- Signatures génériques à vérifier en présence d'une telle mention : **367**.
- Titres récurrents : **192**.
- Titres génériques : **66**.

Ces statistiques comptent les signalements, non les erreurs établies ni les articles uniques affectés. Les règles d'analyse sont indicatives : elles ne détectent pas toutes les reprises, ne tranchent aucun droit d'auteur et ne permettent pas de qualifier juridiquement la provenance. Une absence d'erreur structurelle détectée ne vaut pas certification du contenu.

### Ordre de traitement éditorial

1. **Provenance et crédit** : examiner conjointement les 368 mentions de sources et les 367 signatures génériques.
2. **Format éditorial** : distinguer brèves, sélections de liens, dépêches reprises et articles rédigés parmi les 513 contenus courts.
3. **Titres** : examiner les 192 récurrences et les 66 titres génériques, avec conservation des URL historiques.
4. **Contrôle juridique et factuel** : vérifier les dates, le statut procédural et l'éventuelle évolution d'affaires avant tout ajout ou réécriture.

Aucune modification automatique des articles n'est autorisée par cet audit.

## Suite du chantier
Lancer `IC_ARTICLES=articles-prives/articles npm run audit:archives` sur le fonds complet ; rapprocher les anomalies détectées des fichiers d'origine ; établir une liste de corrections validées, puis tester les éventuelles améliorations de présentation.
