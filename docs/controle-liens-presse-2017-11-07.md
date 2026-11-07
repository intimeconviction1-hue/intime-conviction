# Contrôle ciblé des liens de presse des archives de février 2017

Date du contrôle : 7 novembre 2026.

## Périmètre

Deux archives privées : `articles/2017/13329-2.json` et `articles/2017/13366-2.json`, soit 26 liens historiques. Il ne s'agit **pas** d'un contrôle exhaustif des 26 destinations.

## Résultats documentés

- LINFO.RE, 3 février 2017, couple Aho-Nienne : page de presse d'origine accessible ; https://www.linfo.re/la-reunion/faits-divers/711342-meurtre-du-couple-aho-nienne-3-agresseurs-condamnes-a-la-perpetuite .
- L'Est Républicain, 25 février 2017, cour d'assises du Jura : article accessible, début consultable, accès au reste sur abonnement ; https://www.estrepublicain.fr/actualite/2017/02/25/viols-sur-mineur-15-ans-de-reclusion .
- Le Progrès, 21 février 2017, Jura : article accessible, peine de huit ans indiquée ; https://www.leprogres.fr/faits-divers/2017/02/21/assises-huit-de-prison-pour-avoir-viole-sa-propre-fille .
- Le Parisien, 3 février 2017, affaire de Grigny : article accessible ; le père est condamné à douze ans, la mère acquittée ; https://www.leparisien.fr/essonne-91/grigny-10-a-12-de-reclusion-requis-contre-le-pere-infanticide-03-02-2017-6651591.php . Le libellé de l'archive a été précisé (commit privé `163fe51a2c874a00716d8bbcea8a7a151a672f43`).
- La Dépêche du Midi, 24 février 2017, fusillade de L'Isle-Jourdain : article accessible, condamnation à dix ans en première instance et appel annoncé par l'avocat ; https://www.ladepeche.fr/article/2017/02/24/2523747-fusillade-isle-jourdain-14-ans-requis-encontre-jacques-fajardo.html . Le libellé de l'archive précise la réserve sur l'appel (commit privé `7e355f933f76f37cc1ecd5c6fc04d46bb664993c`).

## Accès non confirmé

- Paris Match, « Le tueur aux mocassins » : l'outil de consultation n'a pas pu ouvrir l'adresse historique. Il ne s'agit pas d'une preuve de suppression du contenu.
- Ouest-France, dossier des anciens skinheads à Rennes : même situation. L'URL d'origine est conservée dans l'attente d'un contrôle complémentaire.

## Méthode

Aucun lien d'origine n'a été supprimé. Deux adresses ouvertes avec succès sont désormais proposées en HTTPS, sur le même chemin historique. La distinction entre condamnation en première instance et recours annoncé a été ajoutée à partir du contenu de presse consultable. Les liens restants nécessitent un examen individuel avant toute correction. Les URL internes des archives du journal sont inchangées.

Les gabarits et mécanismes de publication contrôlés par l'autre session ne sont pas concernés.

## Complément : liens et qualifications du 7 novembre 2026

- Le Dauphiné Libéré, 31 janvier 2017, Vaucluse : la page est consultable, malgré un espace d'abonnement. Elle indique explicitement **dix ans de réclusion prononcés** à 17 h 30 et **quinze ans requis** à 12 h 30. Le libellé du fonds a été clarifié et l'URL est passée en HTTPS, avec le même chemin historique.
- Var-Matin, dossier évoquant une accusation de viol : accès bloqué par le site au navigateur de vérification. L'ancien libellé « Six ans » n'a pas pu être rattaché avec certitude à une décision judiciaire. Il a été remplacé par « audience rapportée (peine non vérifiée) », sans supprimer le lien.
- Ouest-France, procès de trois anciens skinheads à Rennes : l'URL de presse n'est pas accessible au navigateur utilisé. Son intitulé historique évoque des personnes « jugées » mais ne certifie pas des peines de « 4 et 5 ans avec sursis ». Les chiffres non vérifiés ont été retirés du libellé, avec le lien conservé.
- Paris Match, article de 2017 sur le « tueur aux mocassins » : consultation bloquée ; aucune conclusion d'indisponibilité permanente ni remplacement inventé.

Correction de ces trois libellés dans le dépôt privé : `40f927c7e99d4b8a37fde87ec9d368383e01a429`. Les URL de la revue de presse et les liens externes non vérifiés sont préservés.

**Limite du contrôle :** un échec de consultation, une restriction robots ou un abonnement ne prouvent pas qu'un article a disparu. Les 26 destinations n'ont pas toutes été validées une par une ; les conclusions portent uniquement sur les entrées examinées.

## Complément : décision de la Cour de cassation du 20 juin 2018

L'affaire de Kodjo Ben Hodor, dite du « tueur aux mocassins », signalée dans la revue de presse du 4 février 2017, bénéficie désormais d'une source judiciaire primaire : [Cour de cassation, chambre criminelle, 20 juin 2018, pourvoi n° 17-82.237](https://www.courdecassation.fr/decision/5fca8c597c06047eb3833736), rejet du pourvoi dirigé contre l'arrêt de la cour d'assises de Seine-et-Marne du 27 janvier 2017 (22 ans de réclusion pour assassinat). La mention de cette décision est ajoutée au lien Paris Match déjà archivé ; il n'a pas été supprimé. Commit privé : `3a445867579f62664d391ea79f7b89df54972fa0`.

Le reportage de presse Europe 1 avec AFP daté du 30 janvier 2017 confirme le verdict d'appel et l'acquittement d'un autre chef poursuivi : https://www.europe1.fr/faits-divers/le-tueur-aux-mocassins-condamne-en-appel-a-22-ans-pour-assassinat-2964821 . La décision de cassation constitue ici la référence procédurale principale. Les archives relatives à Rennes et au Var restent sous vérification pour leurs suites judiciaires ; un article décrivant l'ouverture d'un procès ne doit pas être confondu avec le compte rendu du verdict.

## Complément : dossier de Rennes et dossier du Var

**Rennes, 3 février 2017.** Le lien Ouest-France historique décrit le procès de trois anciens skinheads après la mort de Frédéric Bourget. Une reproduction secondaire attribuée à Ouest-France, retrouvée lors du contrôle du 7 novembre 2026, rapporte deux condamnations à cinq ans dont trois avec sursis et une condamnation à quatre ans dont deux avec sursis. **Limite :** le texte original directement sur Ouest-France, les décisions intégrales et leurs éventuels recours n'ont pas été consultés. Le libellé de l'archive a été complété avec ces réserves, sans lien public ajouté vers le site de republication. Commit privé final : `bc3a726d9ad0f6e46164aca0be2f05da844ca94d`.

**Var, début février 2017.** Le lien historique Var-Matin relate une audience d'une personne accusée de viol de la compagne de son beau-fils, mais le verdict et son statut procédural n'ont pu être retrouvés avec une source suffisamment précise. La mention « peine non vérifiée » demeure ; aucune condamnation n'est ajoutée. Ne pas associer à cette affaire d'autres procès pour viol dans le Var aux protagonistes non identifiés.

**Méthode :** il n'est pas possible de déduire l'existence d'une décision définitive d'une reprise de presse, même citant une peine. Les deux liens historiques sont conservés et les dates des anciennes pages du journal ne changent pas.
