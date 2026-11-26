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
