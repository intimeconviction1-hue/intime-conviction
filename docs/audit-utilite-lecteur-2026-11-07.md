# Audit d’utilité pour le lecteur, 7 novembre 2026

## Objectif

Évaluer les parcours éditoriaux publics à partir des fichiers Astro, en distinguant ce qui sert un lecteur de ce qui relève de la collecte, de la veille, des métriques de rédaction ou de la démonstration technique. Cette revue porte sur la structure et la copie des pages : elle ne remplace pas un test utilisateur ou une validation complète du rendu sur navigateur.

## Retrait effectué

- **Dossiers** (`src/pages/dossiers/[slug]/[...page].astro`) : suppression de l’histogramme mensuel « rythme des alertes », des statistiques de médias et d’années de veille, du tableau annuel de « mentions » pointant sur des archives générales non filtrées, et de l’encadré de dates dérivées des alertes. Titres, sources, liens, pagination, chronologie judiciaire et URL des dossiers conservés. Commit `790f1cdc`.
- **Chronologie** (`src/pages/chronologie/index.astro`) : suppression du tableau « écho des audiences » et de la deuxième chronologie de fréquence médiatique ; remplacement d’une longue explication par une mise en garde courte distinguant date judiciaire et date de presse. Repères judiciaires sourcés et filtres conservés. Commits `0c44522c`, `dde79e4d`.
- **Rôles d’audience** (`src/pages/veille-roles.astro`) : suppression de la procédure interne de vérification en quatre étapes et de l’indicateur de vanité « 0 audience publiée sans vérification ». Le lien vers les tickets GitHub est remplacé par un accès direct à l’agenda public. Liens officiels et avertissements utiles conservés. Commit `642b18fc`.
- **Composant obsolète** `src/components/CouvertureMensuelle.astro` : supprimé après retrait de son appel public. Commit `74da20af`.

## Parcours inspectés, jugés utiles à conserver

| Parcours | Valeur lecteur | Décision |
| --- | --- | --- |
| Accueil | Découvrir les sujets, dossiers, actualités, archives | Conserver, simplifier progressivement la densité |
| Agenda des sessions | Préparer le suivi des sessions annoncées par des autorités officielles | Conserver ; distinguer sessions et procès |
| Annuaire des cours | Trouver une juridiction et ses coordonnées | Conserver |
| Carte des juridictions | Localiser les lieux des étapes des dossiers | Conserver comme complément, pas comme carte des crimes |
| Chronologie judiciaire | Reconstituer la procédure avec dates, sources et recours | Conserver, supprimer la métrique médiatique |
| Dossiers | Rassembler des repères et des références de presse | Conserver les sources, retirer les indicateurs d’alertes |
| Assister à une audience | Informations pratiques pour le public et les jurés | Conserver |
| Comprendre le procès | Pédagogie et lexique judiciaire | Conserver |
| Jurisprudence | Explications de la procédure et renvois aux sources | Conserver, enrichir plus tard de décisions analysées |
| Recherche | Retrouver articles et dossiers | Conserver |
| Archives historiques et revue de presse | Retrouver les publications et leurs provenances | Conserver les deux fonds distincts |
| Pages d’articles et de rubriques | Lecture, sources, hiérarchisation | Conserver ; traiter les contenus litigieux au cas par cas |
| Culture | Livres, films, représentations du procès | Conserver si relié à l’angle judiciaire |
| Ligne éditoriale et mentions légales | Transparence, conformité et confiance | Conserver |
| 404 | Retrouver un chemin après un lien perdu | Conserver |

## Autres points à améliorer, sans suppression aveugle

1. **Accueil :** réduire les séries de rubriques et liens redondants en fonction des parcours réellement utilisés. Ne pas effacer des accès utiles sans tester la navigation.
2. **Dossiers :** distinguer nettement les articles originaux d’Intime Conviction des simples liens de veille externe. Une couverture médiatique abondante ne signifie pas un dossier journalisé.
3. **Chronologie :** le nombre d’étapes sourcées peut informer sur le périmètre mais n’est pas une mesure de qualité ou de pertinence ; le contenu et la fiabilité priment.
4. **Annuaire et carte :** vérifier la mise à jour des liens institutionnels et leur précision, sans déduire du lieu du tribunal le lieu des faits.
5. **Veille des rôles :** privilégier les liens vers les autorités et les dates effectivement publiées plutôt que les explications sur le processus de rédaction.

## Principes de conservation

- Les URL existantes, articles, pagination, filtres fonctionnels, sources et avertissements juridiques ne doivent pas être supprimés au titre d’un simple allègement.
- Ne pas effacer une information requise pour comprendre la présomption d’innocence, l’existence d’un recours ou les limites des sources.
- Vérifier la compilation et la publication GitHub Pages après toute modification.
- Coordonner via les commits et les tickets GitHub les changements simultanés de l’autre session.

## Revue complémentaire de l’accueil

Un examen de la page d’accueil a relevé deux blocs successifs qui invitaient à consulter les archives : le bandeau de comptage « Les archives du journal » et le répertoire détaillé « Les archives » avec liens par année. Le premier a été retiré, tandis que le second, réellement navigable, a été conservé. Aucun article ni URL n’est supprimé.

Le compteur de références externes précédemment présenté comme des « nouvelles » dans les rubriques a été reformulé en « références de presse ». Cette distinction évite de confondre les titres de veille répertoriés avec des articles d’actualité publiés par la rédaction.

Commit : `896c7d5c7cd8883224b363f32e9aecb3d78418c2`.

### Analyse des sections restant visibles

- **Accueil, « Explorer le journal »** : conservation provisoire, car ces liens organisent les rubriques en parcours concrets. Risque de répétition avec « Les rubriques du journal » : simplification possible après validation du parcours utilisateur, sans supprimer l’accès à des rubriques.
- **Accueil, rubrique culturelle** : à conserver lorsqu’elle porte réellement sur les représentations judiciaires.
- **Annuaire, « Comment trouver une audience »** : conservation, information pratique qui aide le lecteur à utiliser les sources officielles.
- **Jurisprudence, questions de droit** : conservation provisoire à titre pédagogique ; renforcer le lien avec des décisions précises plutôt que supprimer l’entrée.
- **Pages légales et ligne éditoriale** : à préserver, même si elles sont peu consultées, en raison de la transparence et des obligations éditoriales.

**Limite :** la revue est un audit éditorial structurel du code source ; elle ne démontre pas la performance UX ou les usages réels sans données de navigation et tests lecteurs.
