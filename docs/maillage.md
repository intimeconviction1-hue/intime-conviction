# Maillage des articles

La génération Astro indexe les articles publiés et vérifiés. Le titre et le chapô peuvent indiquer un enjeu juridique. Ils ne suffisent jamais à identifier une affaire, une personne ou une juridiction.

Dans le JSON d’un article, la rédaction peut ajouter un objet `maillage` avec les champs facultatifs suivants.

| Champ | Valeur |
| --- | --- |
| affaire | Identifiant éditorial commun à une procédure vérifiée |
| personnes | Identifiants vérifiés et désambiguïsés, jamais un patronyme seul |
| juridiction, territoire | Identifiants de la juridiction d’audience et du territoire pertinent |
| qualifications, enjeux, jurisprudence | Listes d’identifiants éditoriaux. Pour un arrêt, préférer l’ECLI |
| etape | Stade documenté. Utiliser `audience` pour un compte rendu de débats |
| recommander, exclure | Listes de chemins canoniques, avec barre finale |

Les étapes et la proximité des dates départagent des rapprochements déjà justifiés. Jusqu’à six recommandations sont affichées, une seule fois par destination. Les archives sont identifiées séparément. La rédaction peut écarter un résultat ou imposer une passerelle documentaire.


## Contrôle du graphe publié

Le workflow parcourt les pages HTML indexables après le build et conserve pendant
trente jours les liens cassés, les pages inaccessibles depuis l’accueil, la
profondeur, les canoniques, les redirections statiques et les recommandations.
Le rapport expose aussi jusqu’à 100 exemples de liens vers des pages non
indexables et les pages atteignables à plus de trois clics. Les nombres de liens
comptent des occurrences, pas des destinations uniques. Les illustrations sont
dédoublonnées sur l’ensemble des modules d’un article.

## Métadonnées et limites éditoriales

Les thèmes juridiques contrôlés sont recherchés dans le titre, le chapô et le texte
de l’article. Ils ne servent qu’à proposer des lectures thématiques et apparaissent
sous l’intitulé « Même enjeu juridique, autres affaires », avec une précision visible
que les affaires, les faits ou les personnes ne sont pas réputés liés. Une
correspondance de personne ou d’affaire exige toujours les métadonnées éditoriales
explicites.

Le rapport regroupe les destinations non indexables par URL, occurrence et nombre
de pages sources. Les exclusions actuellement documentées sont les pages utilitaires
`/connexion/` et `/abonnement/`, les deux moteurs de recherche, et l’archive de
Grasse conservée avec une notice de vérification. Toute nouvelle destination reçoit
le statut « à vérifier » jusqu’à justification éditoriale. Les redirections sont
classées séparément; une destination manquante est une erreur technique.

## Contrôles de publication

Le contrôle de branche et de publication construit le site avec le fonds privé,
sans rafraîchir la veille externe. Il conserve le rapport de graphe 30 jours et
refuse les liens cassés, les canoniques non conformes et les images manquantes.
Les pages profondes, les pages orphelines, le CLS et le LCP des quatre pages
mobiles prioritaires sont mesurés dans des artefacts GitHub Actions.
