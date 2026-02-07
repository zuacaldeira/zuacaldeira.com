import { Translations } from '../models/i18n';

export const fr: Translations = {
  nav: {
    home: 'Accueil',
    about: 'À propos',
    research: 'Recherche',
    work: 'Travail',
    paedagogik: 'Pédagogie',
    running: 'Course',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    tagline: 'Chercheur. Développeur. Éducateur. Coureur.',
    location: 'Lisbonne → Berlin',
    aboutCta: 'À propos de moi',
    contactCta: 'Me contacter',
  },
  about: {
    title: 'À propos',
    subtitle: 'De Lisbonne à Berlin — un parcours entre recherche, code, éducation et course.',
    journeyHeading: 'Le Parcours',
    journeyP1:
      "J'ai grandi à Lisbonne, au Portugal, où j'ai étudié l'informatique à l'Université de Lisbonne. Sous la direction de <strong>Vasco T. Vasconcelos</strong>, j'ai exploré le monde des <strong>Session Types</strong> — une discipline de types pour les systèmes concurrents et distribués qui garantit la sécurité des communications par construction.",
    journeyP2:
      "Ma recherche a été présentée à <strong>POPL</strong>, l'une des principales conférences en théorie des langages de programmation. Cette expérience a façonné ma vision du logiciel : les types comme spécifications, les programmes comme preuves, la correction par conception.",
    berlinHeading: 'Chapitre Berlin',
    berlinP1:
      "À Berlin, j'ai combiné ma formation en génie logiciel avec une nouvelle vocation : <strong>l'éducation de la petite enfance</strong>. Je suis actuellement en formation d'<em>Erzieher</em> (éducateur reconnu par l'État) à la <strong>Freie Fachschule Berlin</strong>, tout en développant des logiciels pour le jardin d'enfants bilingue portugais-allemand <strong>Kita Casa Azul</strong>.",
    berlinP2:
      "Sur le plan technique, je travaille avec <strong>Angular</strong> et <strong>Spring Boot</strong>, développant tout, du <strong>site web Casa Azul</strong> à l'application interne de <strong>Dienstplan</strong> (planification des équipes). J'ai également développé la présence web de <strong>l'Ambassade d'Angola à Berlin</strong>.",
    beyondHeading: 'Au-delà du travail',
    beyondP1:
      'Je suis coureur amateur, m\'entraînant au fil des saisons berlinoises. Du Silvesterlauf au Marathon de Berlin, la course me garde ancré et donne une structure à tout le reste.',
  },
  research: {
    title: 'Recherche',
    subtitle:
      'Session Types pour la programmation concurrente sûre, sous la direction de Vasco T. Vasconcelos.',
    profilesHeading: 'Profils de recherche',
    abstract:
      'Nous présentons un système de types pour un langage fonctionnel avec multithreading et canaux de communication typés par sessions, garantissant la sécurité des communications et l\'absence de deadlocks.',
  },
  work: {
    title: 'Travail',
    subtitle: "Projets logiciels — Angular, Spring Boot et l'écosystème Casa Azul.",
  },
  paedagogik: {
    title: 'Pédagogie',
    subtitle:
      'Erzieher en formation à la Freie Fachschule Berlin — travaux académiques et présentations.',
    intro:
      'Je suis actuellement en formation d\'éducateur reconnu par l\'État (<em>Erzieher</em>) à la <strong>Freie Fachschule für Sozialpädagogik Berlin</strong>. Ci-dessous, vous trouverez mes travaux académiques et présentations du programme.',
    tabFacharbeiten: 'Facharbeiten',
    tabPraesentationen: 'Präsentationen',
  },
  running: {
    title: 'Course',
    subtitle: 'Entraînement et compétitions au fil des saisons berlinoises.',
    upcomingHeading: 'Prochaines courses',
    completedHeading: 'Terminées',
    stravaButton: 'Suivre sur Strava',
    upcoming: 'À venir',
  },
  contact: {
    title: 'Contact',
    subtitle: 'Restons en contact — contactez-moi via l\'un de ces canaux.',
  },
  footer: {
    tagline: 'Chercheur. Développeur. Éducateur. Coureur.',
    pagesHeading: 'Pages',
    connectHeading: 'Connexion',
  },
  common: {
    source: 'Code source',
    live: 'En ligne',
    pdf: 'PDF',
    skipToContent: 'Aller au contenu principal',
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    openMenu: 'Ouvrir le menu',
  },
  roleCards: [
    {
      title: 'Chercheur',
      description: "Session Types, POPL, avec Vasco Vasconcelos à l'Université de Lisbonne.",
    },
    {
      title: 'Développeur',
      description:
        "Angular + Spring Boot. Développement d'applications web pour l'écosystème Casa Azul.",
    },
    {
      title: 'Éducateur',
      description: 'Erzieher en formation à la Freie Fachschule Berlin.',
    },
    {
      title: 'Coureur',
      description: "Coureur amateur s'entraînant pour des courses et marathons à Berlin.",
    },
  ],
  projects: [
    {
      description:
        "Site officiel de la Kita Casa Azul, un jardin d'enfants bilingue portugais-allemand à Berlin. Développé avec Angular 21, Angular Material et SSR prerendering.",
    },
    {
      description:
        "Application de planification des équipes pour l'équipe du jardin d'enfants Casa Azul. Frontend Angular avec backend Spring Boot, avec mode sombre et accès basé sur les rôles.",
    },
    {
      description:
        "Présence web de l'Ambassade d'Angola à Berlin. Site d'information professionnel au service de la communauté de la diaspora angolaise en Allemagne.",
    },
    {
      description:
        'Ce site personnel — développé avec Angular 21, Material 3, SSR prerendering et déployé sur GitHub Pages.',
    },
  ],
  facharbeiten: [
    {
      description:
        "Réflexion écrite sur l'identité professionnelle dans le cadre du programme de formation d'éducateurs.",
    },
    {
      description:
        "Travail SOL sur la théorie des systèmes écologiques de Bronfenbrenner dans le contexte d'environnements de vie divers.",
    },
    {
      description:
        "Réflexion et résumé de film sur l'anthroposophie dans le contexte de la pédagogie Waldorf.",
    },
    {
      description:
        "Réflexion et résumé de film révisés sur l'anthroposophie dans le contexte de la pédagogie Waldorf.",
    },
  ],
};
