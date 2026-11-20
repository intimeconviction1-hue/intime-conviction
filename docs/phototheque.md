# Photothèque INTIME CONVICTION

Le ZIP **IMAGES.zip** contient 564 images lisibles, dont 48 copies exactes ; la photothèque préparée comporte **516 WebP distincts**. L'archive complète ne figure pas dans le dépôt tant que ses fichiers binaires n'y ont pas été transférés.

## Import de l'archive préparée

Depuis la racine du dépôt : `npm run phototheque:import -- /chemin/intime_conviction_phototheque_complete.zip`

Committer ensuite le dossier `public/phototheque/`. Le script contrôle les 516 noms et évite les chemins dangereux. Le contenu est servi aux URL `/phototheque/<nom>.webp`. Les fichiers `catalogue.json` permettent d'attribuer des visuels aux articles.

## Politique éditoriale

Chaque illustration doit être choisie pour son rapport au sujet, validée et identifiée. Un dessin générique ne doit jamais être présenté comme un croquis de l'audience. Les photos de procès historiques ne sont pas des documents sur les procès contemporains. Ne pas utiliser de visuels d'identités, de victimes ou d'accusés hors contexte. Sur les listes et la une, réserver les images déjà affichées avant de choisir les suivantes. Les droits d'exploitation de la collection ont été confirmés par le propriétaire du média ; les légendes restent nécessaires pour éviter les confusions de contexte.

## État

Importeur prêt. Les 516 fichiers binaires restent à transférer vers le dépôt pour rendre les URL publiques. Ne pas confondre une modification de code avec une publication effective.
