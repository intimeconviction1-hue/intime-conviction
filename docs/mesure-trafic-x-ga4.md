# Mesurer les lecteurs venant de X

État au 19 novembre 2026 :
- Les posts X publiés par le workflow GitHub passent déjà les paramètres suivants dans les URLs :
  `utm_source=x&utm_medium=social&utm_campaign=articles_redaction`.
- Les métriques de posts (impressions, clics) sont relevées chaque matin dans GitHub Actions.
- Aucune propriété Google Analytics 4 n’est actuellement disponible dans le compte Google connecté à OpenSEO. Ne pas afficher de visites du site tant qu'une mesure côté site n'existe pas.
- Aucun traceur Google Analytics n’a été ajouté au site.

## Étapes nécessaires

1. Dans https://analytics.google.com, se connecter avec le compte professionnel du journal et créer un compte/propriété Google Analytics 4 si nécessaire.
   - Nom de la propriété : **Intime Conviction**
   - Fuseau : **France / Europe-Paris**
   - Devise : **EUR**
2. Créer un **flux de données Web** pour `https://www.intimeconviction.fr`. Copier l’identifiant de mesure `G-...`.
3. **Avant d’activer le traceur**, mettre en place une information complète et une gestion du consentement conforme aux règles applicables de la CNIL, avec refus aussi simple que l’acceptation. Les tags non essentiels ne doivent pas être chargés avant accord. Prévoir une possibilité de modifier son choix. Ne pas ajouter le code standard GA4 directement dans le HTML sans ce contrôle.
4. Configurer le traceur avec le véritable ID de mesure, puis tester la collecte en temps réel avec un accord explicite.
5. Dans OpenSEO, ouvrir le projet **Intime Conviction**, section **Integrations**. Actualiser la liste des propriétés GA4 disponibles du compte connecté et sélectionner la propriété créée.
6. Dans les rapports GA4 d’acquisition, comparer `source / medium = x / social`, la campagne `articles_redaction`, les pages de destination et les sessions. Les clics Buffer et les sessions GA4 sont des indicateurs distincts et peuvent différer.

## Contrôles et limites

- L'API de statistiques Buffer est expérimentale et peut actualiser ses données avec retard.
- Les chiffres de Buffer ne prouvent pas que les lecteurs ont effectivement chargé le journal.
- Les URLs suivies servent uniquement à l'attribution de trafic une fois une solution d'analyse de site correctement configurée.
- Aucun abonnement payant ne doit être souscrit dans cette procédure sans accord explicite.

Sources officielles :
- Google : https://support.google.com/analytics/answer/14183469
- CNIL : https://www.cnil.fr/fr/mesurer-la-frequentation-de-vos-sites-web-et-de-vos-applications
- CNIL : https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience
