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


## Mesures avant / après

Comparaison avec le rapport de départ du 26 novembre et le build complet de
la branche, mesuré le 28 novembre 2026 à 15:00 UTC. Les pourcentages de
recommandations sont calculés sur les 3 503 articles du fonds.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Liens internes cassés | 77 occurrences sur 74 cibles / 47 pages | 0 |
| Liens vers des pages noindex | 8 104 occurrences, non classées individuellement dans le rapport initial | 8 114 occurrences, 5 destinations uniques, 5 exclusions documentées, 0 à vérifier |
| Profondeur moyenne | 5,25 clics | 2,90 clics |
| Profondeur médiane | 3 clics | 3 clics |
| Profondeur maximale | 76 clics | 3 clics |
| Pages au-delà de 3 clics | 359 | 0 |
| Pages orphelines | 1 (/feed/) | 0 |
| Articles avec recommandations | 126 / 3 503 (3,6 %) | 1 731 / 3 503 (49,4 %) |
| Liens de recommandation | 646 | 10 023 |
| Images locales cassées | 0 | 0 |
| Canoniques non conformes | 0 | 0 |

Le rapport final recense 3 956 pages indexables, 279 600 liens internes,
20 576 images locales et les cinq destinations noindex suivantes : les pages
utilitaires abonnement et connexion, les deux moteurs de recherche internes,
et une notice d’archive en attente de vérification juridique. Aucune n’a été
rendue indexable.

### Mesure mobile de prépublication

Mesure Chromium automatisée sur l’aperçu local du build, viewport 375 px,
28 novembre 2026. Les chiffres sont des mesures de laboratoire du runner CI,
pas des données d’utilisateurs réels. Le délai d’interaction est une mesure
locale d’événement et ne constitue pas l’INP terrain.

| Page | CLS mesuré | LCP mesuré | Délai d’interaction local |
| --- | ---: | ---: | ---: |
| Accueil | 0,00 | 136 ms | 16 ms |
| Carte des juridictions | 0,00 | 88 ms | 16 ms |
| Annuaire | 0,00 | 124 ms | 16 ms |
| Assister | 0,00 | 84 ms | 16 ms |

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
