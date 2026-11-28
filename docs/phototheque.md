# Photothèque éditoriale privée

Les 516 WebP sont conservés exclusivement dans le dépôt privé `intimeconviction1-hue/intime-conviction-articles/phototheque/images/`.

Les attributions individuelles sont fixées dans `phototheque/attributions.json` du dépôt privé. La sélection éditoriale est actualisée dans ce fichier d’attributions, notamment pour les articles mis à la une. La sélection privilégie des salles d'audience, les bancs, les dossiers, la barre des témoins ou les frontons, sans représenter abusivement une autre affaire comme celle traitée.

Le workflow `.github/workflows/publier.yml` exécute `scripts/preparer-illustrations.mjs` avant le build. Ce script vérifie les articles, refuse toute attribution dupliquée, copie **seulement** les WebP des articles publiables dans l'artefact du site, et fournit un petit manifeste temporaire utilisé par `src/lib/photos-articles.mjs`.

Un article nouveau ne reçoit pas arbitrairement une image de la collection : l'attribution doit être ajoutée explicitement au dépôt privé après vérification du contenu. Les autres images ne sont jamais exposées aux lecteurs.

Pour modifier une illustration, changer uniquement l'entrée correspondante dans le fichier d'attributions du dépôt privé puis reconstruire le site. Les photographies génériques ont une légende précisant qu'elles ne représentent pas l'audience en question. Les droits sont déclarés détenus par le média.

## Manchette de l'accueil

La photographie `photos_assises-img-5317-3964923-caebef1a3.webp` est réservée à l'identité visuelle du journal (photographie d'archives, trois magistrats). Elle est copiée uniquement dans l'artefact de publication sous `illustrations-articles/manchette-accueil.webp`, sans exposer la photothèque ni committer le fichier dans le dépôt public. Ne pas la réattribuer aux articles ou aux cartes de presse. En l'absence de dépôt privé, le fronton existant sert de repli visuel.
