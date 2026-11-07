# Contrôle éditorial des attributions — lot 01
Date : 7 novembre 2026.
Statut : **vérification documentaire initiale, aucune correction de signature validée**.

## Méthode
Lecture des corps HTML et métadonnées du dépôt privé `intime-conviction-articles`. Les mentions de sources sont des faits observables dans les fichiers ; elles ne démontrent pas à elles seules la propriété du texte, une autorisation de republication, ni l'absence de travail éditorial original.

## Cas examinés

### 1. « 12 hommes en colère » (4 novembre 2017)
- Fichier : `articles/2017/12-hommes-en-colere-theatre-hebertot-jusquau-7-janvier-2018.json`.
- URL historique : `/12-hommes-en-colere-theatre-hebertot-jusquau-7-janvier-2018/11/2017/`.
- Métadonnée `auteur` : « Intime Conviction ».
- **Constat direct** : première ligne « SOURCE » avec lien vers un article de Dalloz Actualité ; le corps contient une signature explicite « par Thibault de Ravel d'Esclapon » et un lien vers sa page auteur sur le même site.
- **Vérification externe du 7 novembre 2026** : article original accessible chez [Dalloz Actualité](https://www.dalloz-actualite.fr/flash/12-hommes-en-colere-theatre-hebertot-jusqu-au-7-janvier-2018), publié le **3 novembre 2017** et signé **Thibault de Ravel d'Esclapon**. Le contenu de l'archive reprend le texte disponible chez Dalloz, dont le titre et les passages examinés correspondent. Provenance éditoriale **confirmée**.
- **Diagnostic** : attribution originelle confirmée chez Dalloz, divergente du champ `auteur` issu de l'import WordPress. **L'autorisation de republication demeure inconnue.**
- **Décision** : crédit source à rectifier après vérification des droits et de la politique de conservation. Ne pas remplacer automatiquement le champ `auteur` ni supprimer l'archive ; maintenir ce dossier en priorité maximale.

### 2. « 14 ans de prison pour avoir étranglé un camarade de lycée » (10 décembre 2009)
- Fichier : `articles/2009/14-ans-de-prison-pour-avoir-etrangle-un-camarade-de-lycee.json`.
- URL historique : `/14-ans-de-prison-pour-avoir-etrangle-un-camarade-de-lycee/12/2009/`.
- Métadonnée `auteur` : « Intime Conviction ».
- **Constat direct** : en ouverture, « NOUVELOBS.COM | 10.12.2009 | 13:35 », puis la mention « (Reuters) ». Un lien pointe vers une page de réactions de l'ancien site Nouvel Obs, qui n'est pas une preuve d'URL canonique de l'article.
- **Diagnostic** : deux crédits de presse explicites dans le corps ; l'original précis et les droits sont à confirmer.
- **Décision** : vérifier les crédits, l'original de Reuters et l'historique de republication. Protection renforcée des détails relatifs à un procès de mineur.

### 3. « 15 ans de prison au pirate des Caraïbes » (14 mai 2009)
- Fichier : `articles/2009/15-ans-de-prison-au-pirate-des-caraibes.json`.
- URL historique : `/15-ans-de-prison-au-pirate-des-caraibes/05/2009/`.
- Métadonnée `auteur` : « Intime Conviction ».
- **Constat direct** : l'article commence par « AFP - ». Aucun lien source n'apparaît au début du corps inspecté.
- **Diagnostic** : mention explicite d'agence dans l'archive ; ne pas attribuer sans vérification la totalité du texte à l'AFP ni à la rédaction.
- **Décision** : examiner la dépêche d'origine et les droits de reprise.

### 4. « Deux fois 17 ans » (24 juin 2009)
- Fichier : `articles/2009/17-ans-de-reclusion-pour-le-predateur-sexuel.json`.
- URL historique : `/17-ans-de-reclusion-pour-le-predateur-sexuel/06/2009/`.
- Métadonnée `auteur` : « Intime Conviction ».
- **Constat direct** : l'en-tête du corps affiche « CLICANOO.COM | 24 juin 2009 », puis un texte narratif détaillé d'audience.
- **Diagnostic** : provenance éditoriale externe probable à vérifier. Ne pas traiter le récit comme un reportage exclusif d'Intime Conviction sans preuve.
- **Décision** : rechercher l'article originel, le crédit du journaliste et les conditions de reproduction.

### 5. « Les peines de la semaine » (4 février 2017)
- Fichier : `articles/2017/13329-2.json`.
- URL historique : `/13329-2/02/2017/`.
- Métadonnée `auteur` : « Intime Conviction ».
- **Constat direct** : 74 mots annoncés, liste de brèves et de liens vers différents journaux (Linfo.re, Paris Match, Le Figaro, Var-Matin, etc.).
- **Diagnostic** : il s'agit d'une sélection de liens, et non d'un reportage unique ; le titre générique rend la recherche historique moins informative.
- **Décision** : conserver le texte et les URL ; envisager un libellé de format « sélection de presse » dans l'interface après validation du périmètre des compilations.

## Recherches externes complémentaires, 7 novembre 2026

- **Dalloz Actualité : provenance confirmée** par [la publication originale du 3 novembre 2017](https://www.dalloz-actualite.fr/flash/12-hommes-en-colere-theatre-hebertot-jusqu-au-7-janvier-2018), qui affiche l'auteur Thibault de Ravel d'Esclapon. La consultation du texte public établit une correspondance substantielle avec le corps de l'archive. Elle n'établit pas le statut des droits de reproduction.
- **Procès d'un mineur, décembre 2009** : [les archives datées du Parisien](https://www.leparisien.fr/archives/2009/10-12-2009/) montrent un sujet portant sur cette condamnation. Cette couverture parallèle ne permet pas de vérifier que l'article Nouvel Obs/Reuters conservé par Intime Conviction provient précisément de ce média ou d'en établir les droits. **Provenance précise non confirmée**.
- **Affaire Cossarini** : un [article du Parisien publié en février 2006](https://www.leparisien.fr/faits-divers/le-pirate-escroc-acquitte-du-meurtre-des-marins-26-02-2006-2006776047.php) confirme l'existence d'une couverture de la procédure antérieure, mais ne constitue **pas** l'original AFP de mai 2009. Ce rapprochement ne valide donc ni le texte ni son crédit.

Les vérifications externes ci-dessus ne changent pas les conclusions sur les droits ; aucune correction massive des archives ne doit en être déduite.

## Priorités

1. **Crédits et droits** : commencer par Dalloz Actualité, puis Reuters/Nouvel Obs.
2. **Attribution** : vérifier séparément la paternité du texte, la provenance de la publication et les droits de reproduction.
3. **Présentation** : ne changer les métadonnées `author` des pages web ou les mentions à l'écran qu'après une décision documentée, applicable aux autres cas similaires.
4. **Intégrité des archives** : conserver intégralement les données et URL historiques lors de cette vérification.

Aucune décision de justice citée dans ces archives n'a été revérifiée auprès d'une juridiction dans le cadre de ce lot. Ne pas présenter les récits anciens comme une information actuelle sur le statut des procédures.
