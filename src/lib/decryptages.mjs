// Décryptages ORIGINAUX : explications éditoriales rédigées pour Intime Conviction.
// Ne pas confondre avec le flux des titres de presse et les événements judiciaires.
// Toute modification substantielle doit être relue et recoupée avec les sources officielles.

export const DATE_REVISION = '2026-11-07';

export const DECRYPTAGES = Object.freeze([
  {
    slug: 'verdict-appel-cassation',
    numero: '01',
    thematique: 'LES RECOURS',
    titre: 'Un verdict ne ferme pas toujours le dossier.',
    question: 'Qu’arrive-t-il après une condamnation ?',
    chapô: 'La salle se vide, les caméras attendent une réaction, un titre proclame le verdict. Mais la décision annoncée est-elle définitive ? Pour comprendre un procès, il faut suivre la procédure jusqu’au bout.',
    lectureMinutes: 4,
    sections: [
      {
        titre: 'L’instant du verdict n’est qu’une étape possible.',
        paragraphes: [
          'Une condamnation de première instance constitue bien une décision de justice. Ce n’est ni une simple accusation, ni nécessairement la conclusion définitive de l’affaire. La possibilité d’un appel oblige à distinguer l’existence du verdict de son caractère irrévocable.',
          'C’est une différence capitale pour le lecteur. Un titre peut annoncer une peine sans que toutes les voies de recours soient épuisées. Dans les chronologies d’Intime Conviction, la première instance et l’appel doivent donc rester identifiables séparément.'
        ]
      },
      {
        titre: 'L’appel permet un nouvel examen.',
        paragraphes: [
          'Dans le système pénal français, les décisions de la cour d’assises et de la cour criminelle départementale peuvent faire l’objet d’un appel. Pour les affaires criminelles, une juridiction d’appel réexamine les débats. La portée exacte de chaque recours doit toujours être vérifiée pour le dossier considéré.',
          'Un appel ne doit pas être raconté comme une annulation déjà acquise. Il ouvre une nouvelle phase de procédure, dont l’issue reste à établir. Les parties peuvent emprunter des voies de recours différentes, notamment selon que la question porte sur la culpabilité, la peine ou les intérêts civils.'
        ]
      },
      {
        titre: 'La cassation ne rejoue pas simplement les faits.',
        paragraphes: [
          'Le pourvoi en cassation n’est pas un troisième procès identique au premier. La Cour de cassation contrôle principalement la conformité de la décision aux règles de droit et de procédure ; elle ne devient pas, par principe, un nouveau jury chargé de refaire toute l’instruction des faits.',
          'La règle de lecture est donc simple : devant chaque annonce judiciaire, se demander quelle juridiction a statué, à quel degré de jugement, sur quoi elle s’est prononcée et quels recours restent ouverts. Un média gagne en précision lorsqu’il pose ces quatre questions avant de raconter la suite.'
        ]
      }
    ],
    aRetenir: 'Mentionner systématiquement « première instance », « appel » ou « cassation » et ne jamais qualifier une condamnation de définitive sans vérification.',
    sources: [
      {nom:'Justice.fr, Faire appel d’un jugement civil ou pénal',url:'https://www.justice.fr/fiche/faire-appel-jugement-civil-penal'},
      {nom:'Justice.fr, Recours en cassation',url:'https://www.justice.fr/fiche/contester-jugement-civil-penal-recours-cassation'}
    ],
    dossiers: ['affaire-jubillar','viols-de-mazan','affaire-pechier']
  },
  {
    slug: 'assises-ou-cour-criminelle',
    numero: '02',
    thematique: 'LES JURIDICTIONS',
    titre: 'Assises ou cour criminelle : ce qui change vraiment.',
    question: 'Pourquoi certains crimes sont-ils jugés sans jury populaire ?',
    chapô: 'Dans les journaux, les mots « assises » et « cour criminelle » se côtoient. Pourtant, derrière ces deux noms se trouvent des formations de jugement différentes. L’enjeu dépasse la simple terminologie.',
    lectureMinutes: 4,
    sections: [
      {
        titre: 'Le jury est une différence décisive.',
        paragraphes: [
          'Dans sa composition ordinaire en première instance, la cour d’assises réunit trois magistrats professionnels et six jurés citoyens. La cour criminelle départementale, elle, est composée de cinq magistrats professionnels et ne comprend pas de jury populaire.',
          'Il ne s’agit pas d’une simple différence de décor. La composition détermine qui prend part aux délibérations sur la culpabilité et la peine. Qualifier une audience de procès « avec jury » lorsqu’elle se tient devant une cour criminelle départementale induirait le lecteur en erreur.'
        ]
      },
      {
        titre: 'La compétence dépend de la nature du dossier.',
        paragraphes: [
          'Les cours criminelles départementales ont été généralisées en 2023. Elles connaissent, selon les conditions fixées par la loi, de certains crimes punis de quinze ou vingt ans de réclusion criminelle, commis par des majeurs et hors récidive légale retenue. Les cours d’assises restent compétentes pour d’autres affaires criminelles, notamment les plus lourdement punies.',
          'Cela signifie qu’on ne peut pas déduire de la seule gravité médiatique d’une affaire le type exact de juridiction compétente. La qualification pénale et les conditions légales comptent davantage que la célébrité du dossier.'
        ]
      },
      {
        titre: 'Et si la décision est contestée ?',
        paragraphes: [
          'Les décisions de ces juridictions peuvent être contestées par voie d’appel. Pour les affaires criminelles, l’appel se tient devant une cour d’assises d’appel, avec une composition distincte de celle de première instance. Une même affaire peut donc circuler entre deux villes et deux formations judiciaires différentes.',
          'Pour lire notre carte judiciaire, il faut garder cette idée en tête : un repère à Avignon et un autre à Nîmes peuvent désigner deux étapes procédurales d’un même dossier, sans qu’il s’agisse de deux affaires indépendantes.'
        ]
      }
    ],
    aRetenir: 'Avant d’écrire « les jurés ont décidé », identifier précisément la juridiction, sa composition et le degré de jugement.',
    sources: [
      {nom:'Cour d’appel de Limoges, Les cours criminelles départementales',url:'https://www.cours-appel.justice.fr/limoges/les-cours-criminelles-departementales'},
      {nom:'Cour d’appel de Bourges, Cour d’assises',url:'https://www.cours-appel.justice.fr/bourges/cour-dassises'}
    ],
    dossiers: ['viols-de-mazan','affaire-jubillar']
  },
  {
    slug: 'anatomie-une-audience',
    numero: '03',
    thematique: 'L’AUDIENCE',
    titre: 'Dans une cour d’assises, qui parle et quand ?',
    question: 'Comment une audience criminelle se déroule-t-elle ?',
    chapô: 'Le procès n’est pas une succession de discours improvisés. Il obéit à une mécanique précise, où le président dirige les débats, où plusieurs voix se confrontent et où l’accusé dispose de la parole en dernier.',
    lectureMinutes: 4,
    sections: [
      {
        titre: 'Tout commence par la direction des débats.',
        paragraphes: [
          'Le président conduit l’audience et présente les faits reprochés à la personne accusée. Celle-ci dispose de droits procéduraux, notamment celui de garder le silence. Les modalités de l’audition et de l’interrogatoire sont encadrées : l’audience n’est pas un interrogatoire policier déplacé dans un palais de justice.',
          'Témoins, experts et parties civiles apportent des éclairages différents. Leurs propos doivent être rapportés en indiquant qui parle, dans quel rôle et sur quel sujet. Une affirmation d’expert, une déclaration de témoin et une thèse de l’accusation n’ont pas la même nature.'
        ]
      },
      {
        titre: 'Chaque parole a une place.',
        paragraphes: [
          'Le président distribue la parole et veille au déroulement des échanges. En fin de débats, les avocats des parties civiles sont entendus, puis le ministère public prononce ses réquisitions. La défense présente ensuite sa plaidoirie. L’accusé est invité à s’exprimer en dernier.',
          'Cette succession explique pourquoi une chronique d’audience doit prêter attention au moment où une déclaration est faite. Un propos avant l’audition des experts et une déclaration finale ne remplissent pas la même fonction dramaturgique ou procédurale.'
        ]
      },
      {
        titre: 'Le délibéré n’est pas une scène publique.',
        paragraphes: [
          'Une fois les débats achevés, la juridiction délibère hors de la salle d’audience. Le public ne connaît pas le détail des échanges du délibéré. Le verdict est ensuite rendu selon les règles applicables à la juridiction.',
          'Un récit fidèle décrit ce qui a été dit publiquement et ce qui a été décidé, mais ne prête pas de pensées ni de conversations secrètes aux juges et aux jurés. C’est un principe d’écriture autant qu’une exigence de précision.'
        ]
      }
    ],
    aRetenir: 'Attribuer chaque déclaration à son auteur, replacer la prise de parole dans la séquence des débats et ne jamais imaginer le contenu du délibéré.',
    sources: [
      {nom:'Cour d’appel de Paris, Fonctionnement d’une cour d’assises spécialement composée (ordre des interventions)',url:'https://www.cours-appel.justice.fr/paris/fonctionnement-de-la-cour-dassises-specialement-composee'},
      {nom:'Cour d’appel de Bourges, Cour d’assises',url:'https://www.cours-appel.justice.fr/bourges/cour-dassises'}
    ],
    dossiers: ['affaire-jubillar','martyre-de-a10']
  },
  {
    slug: 'alerte-presse-ou-evenement',
    numero: '04',
    thematique: 'LA MÉTHODE',
    titre: 'Une date d’alerte n’est pas la date d’un procès.',
    question: 'Comment transformer la veille en mémoire judiciaire fiable ?',
    chapô: 'Une revue de presse livre des traces. Elle ne raconte pas automatiquement une chronologie. Entre l’alerte reçue, l’article publié et l’audience tenue, il peut y avoir plusieurs dates et plusieurs événements.',
    lectureMinutes: 3,
    sections: [
      {
        titre: 'Trois horloges, trois fonctions.',
        paragraphes: [
          'La première horloge est celle de l’événement : ouverture de procès, audition, verdict, décision d’appel. La deuxième est celle de l’article : une rédaction raconte un événement à la date où elle publie. La troisième est celle de la veille : un service d’alertes signale cette publication, éventuellement plus tard.',
          'Ces dates peuvent coïncider, mais elles ne sont pas interchangeables. Un article publié en janvier peut revenir sur une audience de décembre. Un sujet ancien peut réapparaître dans une alerte récente sans que le procès ait repris.'
        ]
      },
      {
        titre: 'Le titre ne remplace pas le dossier.',
        paragraphes: [
          'Les archives d’Intime Conviction réunissent des liens et des titres citant des affaires identifiées. Cette méthode facilite la recherche, mais un simple nom dans un titre ne garantit pas que le texte traite du même épisode judiciaire. Il faut ouvrir la source et vérifier le contexte avant de tirer une conclusion.',
          'Un dossier thématique n’est donc pas, à lui seul, une enquête. Il constitue un point de départ : retrouver la presse, comparer les comptes rendus, identifier les désaccords et chercher, lorsque c’est possible, les décisions ou les informations de la juridiction concernée.'
        ]
      },
      {
        titre: 'La vérification précède le récit.',
        paragraphes: [
          'Pour chaque fait retenu dans une chronologie, la rédaction doit noter la date de l’événement, la juridiction, le stade de la procédure et une source consultable. Pour chaque citation, elle doit identifier l’auteur et le contexte. Pour chaque statut judiciaire, elle doit vérifier si la décision est susceptible de recours.',
          'C’est cette discipline qui sépare un fil de titres d’un média capable de raconter et d’expliquer la justice : la mémoire de ce qui a été publié, sans la confondre avec ce qui a été établi.'
        ]
      }
    ],
    aRetenir: 'Distinguer systématiquement date de l’événement, date de publication et date de l’alerte, puis relier chaque affirmation à sa source.',
    sources: [
      {nom:'Justice.fr, Faire appel d’un jugement civil ou pénal',url:'https://www.justice.fr/fiche/faire-appel-jugement-civil-penal'}
    ],
    dossiers: ['affaire-jubillar','affaire-pechier','viols-de-mazan','martyre-de-a10']
  },
]);

export const ANGLES_A_CREUSER = Object.freeze([
  {titre:'L’appel change-t-il toujours l’issue d’un procès ?',question:'Comparer la décision de première instance et le périmètre exact du recours, sans supposer qu’un appel aboutit à une peine différente.',decryp:'verdict-appel-cassation',dossiers:['affaire-jubillar','viols-de-mazan']},
  {titre:'Ce qu’un jury populaire apporte au procès',question:'Identifier la composition des formations de jugement et distinguer les situations devant assises et cour criminelle.',decryp:'assises-ou-cour-criminelle',dossiers:['viols-de-mazan']},
  {titre:'Le temps long des dossiers criminels',question:'Reconstituer les grandes phases d’une procédure uniquement à partir de dates judiciaires recoupées.',decryp:'alerte-presse-ou-evenement',dossiers:['martyre-de-a10']},
  {titre:'Témoignages, expertise, plaidoiries : ne pas tout confondre',question:'Classer les éléments rapportés selon celui qui parle à l’audience et distinguer faits, déclarations et arguments.',decryp:'anatomie-une-audience',dossiers:['affaire-pechier']}
]);

export function validerDecryptages(articles=DECRYPTAGES, angles=ANGLES_A_CREUSER, dossiers=[]) {
  const slugs=new Set(),dossierSlugs=new Set(dossiers.map(d=>d.slug));
  if(!Array.isArray(articles)||!articles.length) throw new Error('Décryptages absents');
  for(const a of articles){
    if(!/^[a-z0-9-]+$/.test(a.slug??'')||slugs.has(a.slug))throw new Error('Slug de décryptage invalide ou répété');
    slugs.add(a.slug);
    for(const champ of ['titre','question','chapô','aRetenir'])if(typeof a[champ]!=='string'||a[champ].length<15)throw new Error('Décryptage incomplet : '+champ);
    if(typeof a.thematique!=='string'||a.thematique.length<6)throw new Error('Thématique manquante');
    if(!Array.isArray(a.sections)||a.sections.length<3||a.sections.some(s=>s.titre.length<10||s.paragraphes.length<2||s.paragraphes.some(p=>p.length<50)))throw new Error('Corps du décryptage insuffisant');
    if(!Array.isArray(a.sources)||!a.sources.length)throw new Error('Sources de décryptage absentes');
    for(const source of a.sources) {
      let u;try{u=new URL(source.url)}catch{throw new Error('URL de source invalide')}
      if(u.protocol!=='https:'||u.username||u.password||u.port||!['www.justice.fr','www.cours-appel.justice.fr'].includes(u.hostname))throw new Error('Source non institutionnelle');
      if(typeof source.nom!=='string'||source.nom.length<10)throw new Error('Nom de source manquant');
    }
    if(!Array.isArray(a.dossiers)||a.dossiers.some(d=>!dossierSlugs.has(d)))throw new Error('Dossier relié invalide');
  }
  for(const angle of angles){
    if(!slugs.has(angle.decryp)||angle.titre.length<10||angle.question.length<20||angle.dossiers.some(d=>!dossierSlugs.has(d)))throw new Error('Piste éditoriale incomplète');
  }
  return true;
}

export function decryptageParSlug(slug, articles=DECRYPTAGES) {
  return articles.find(a=>a.slug===slug)??null;
}
