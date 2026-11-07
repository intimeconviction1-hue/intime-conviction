# Contrôle éditorial des archives

Ce document est une procédure interne, non une page publiée.

## Principes
- Préserver le texte d'origine, la date de publication, le slug et l'URL historique.
- Distinguer un état de procédure à la date de l'article et une décision ultérieure.
- Ne pas reconstituer un témoignage, un verdict, un nom ou une citation absent des sources.
- Identifier les sources exactes (média, titre, date, URL), pas seulement la page d'accueil d'un journal.
- Signaler les affirmations non confirmées ; ne pas leur donner l'apparence de faits judiciaires établis.
- Supprimer seulement les fragments techniques ou les éléments de navigation WordPress importés par erreur, après comparaison au texte original.
- Contrôler le rendu, les liens et la compilation après chaque modification.
- Toute correction factuelle doit être motivée et traçable dans le commit.

## Premier contrôle : janvier 2025
- `articles/2025/cours-du-jour-17-janvier-2025.json` : titre clarifié ; fragments de navigation WordPress retirés ; références contemporaines ajoutées pour les quatre affaires. Vérifier ultérieurement les décisions judiciaires et l'état des recours.
- `articles/2025/cours-du-jour-6-janvier-2025.json` : titre clarifié ; contrôle des sources et des informations encore nécessaire.
- `articles/2025/tour-de-france-2024.json` : vérification du 7 novembre 2026 ; article recentré sur trois affaires sourcées ; décisions de 2024 et évolutions en appel de 2026 distinguées (Samuel Paty, Eugène Rwamucyo) ; notice sur Nice retirée faute de référence précise. Conserver la version antérieure dans l'historique Git pour toute comparaison.

Le fonds éditorial est stocké dans le dépôt privé `intime-conviction-articles`. Le workflow GitHub Pages du dépôt public reconstruit le site avec ce fonds.
