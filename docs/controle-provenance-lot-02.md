# Contrôle des archives, lot 02 : sélections de presse de février 2017

Date : 7 novembre 2026. Ce dossier complète le suivi de provenance sans changer la présentation générale du site.

## Constats

Les fichiers `articles/2017/13329-2.json` et `articles/2017/13366-2.json` du dépôt privé sont principalement des **listes de liens vers des publications extérieures**, non des reproductions intégrales des articles associés.

Le premier comporte 19 liens, le second 7. Les libellés importés mêlent procès, réquisitions, verdicts et décisions dont l'état des recours n'est pas établi. À titre d'exemple, une source du premier lot évoque des **réquisitions** tandis que son contexte dans la liste peut suggérer une peine prononcée.

## Mesures appliquées

1. Titres modifiés en « Revue de presse judiciaire : semaine du 4 février 2017 » et « Revue de presse judiciaire : semaine du 26 février 2017 », en conservant les slugs et les URL historiques.
2. Notices d'ouverture ajoutées pour expliciter la valeur documentaire, les limites des indications de peines et l'absence de vérification des décisions définitives.
3. Extraits mis à jour ; les 26 liens d'origine et les dates de première publication sont conservés.
4. Balisage HTML importé mal formé du premier article nettoyé, sans supprimer les éléments de la liste.
5. Date de mise à jour éditoriale renseignée au 7 novembre 2026.

Commits privés : `ee47e390bd3b197366b3427c14080ceb349fe60f`, `5626b122b2f00587e69369d7ae21e72f4a3a5c6c`.

## Réserves

Cette correction ne certifie ni l'accessibilité actuelle de chaque lien historique, ni la précision des peines mentionnées, ni l'état des recours. Un contrôle source par source est requis avant de transformer ces sélections en synthèses judiciaires.

## Coordination

Les composants de présentation, les règles de qualification des formats et les pages d'archives de l'autre session n'ont pas été modifiés ici. Les deux corrections restent directement consultables dans le dépôt privé et seront intégrées à la prochaine compilation GitHub Pages.
