# Intime Conviction

Média français consacré aux cours d'assises : le suivi des audiences, les règles du
procès, l'histoire et la culture criminelles.

Site : [intimeconviction.fr](https://www.intimeconviction.fr) · X : [@IntimeConv](https://x.com/IntimeConv)

## Les six rubriques

| Rubrique | Ce qu'on y trouve |
|---|---|
| **Cours du Jour** | Suivi d'audience |
| **Le Banc des Jurés** | Les règles du procès |
| **La Cour se Lève** | Chroniques et ambiances |
| **Délibéré** | Réflexions et opinions |
| **L'Exposé** | Analyses et décryptages |
| **Le Greffe** | Culture criminelle |

Ces noms sont fixés. Ils ne se renomment pas, et aucune rubrique ne s'ajoute sans
décision éditoriale.

## Où on en est

- L'ancien site WordPress est suspendu chez o2switch depuis au moins le
  31 octobre 2026. Ce dépôt le remplace par un site statique (Astro) : une page
  HTML par article, sans base de données.
- 3 436 articles importés de l'export du 29 juillet 2026 (70 écartés faute de
  texte). Ils gardent leur ancienne adresse, `/titre/mois/année/`.
- **La correspondance entre les 23 anciennes catégories et les six rubriques est
  une proposition**, pas encore validée par la rédaction :
  `src/lib/rubriques.mjs`.
- Une veille des affaires d'assises alimente le compte X. Rien ne part sans qu'un
  humain ait validé le commentaire.

## Faire tourner

Les articles sont dans le dépôt **privé** `intime-conviction-articles`, cloné à
côté de celui-ci :

```
C:\dev\intime-conviction            ← ce dépôt (le code)
C:\dev\intime-conviction-articles   ← les articles
```

```
npm install
npm run build      # fabrique le site dans dist/
npm run preview    # le sert sur http://localhost:4321
```

Pour réimporter depuis un nouvel export WordPress (réécrit tout le dossier
`articles/` du dépôt privé) :

```
npm run import -- "<chemin de l'export>.xml"
```

`IC_ARTICLES` permet de lire les articles ailleurs qu'à côté.

## Ce que ce dépôt ne contiendra jamais

Le dépôt est public. Donc jamais :

- de mot de passe, de clé, de code de récupération ou de fichier `.env` ;
- d'export WordPress : il contient les adresses e-mail des commentateurs ;
- de photo ou de dessin d'audience dont les droits ne sont pas à nous.

Le `.gitignore` couvre ces cas. Une règle se pose **avant** d'ajouter le fichier,
et se vérifie avec `git check-ignore -v <chemin>` — sans barre `/` à la fin.
