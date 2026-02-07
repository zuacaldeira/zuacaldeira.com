import { Translations } from '../models/i18n';

export const en: Translations = {
  nav: {
    home: 'Home',
    about: 'About',
    research: 'Research',
    work: 'Work',
    paedagogik: 'Pädagogik',
    running: 'Running',
    contact: 'Contact',
  },
  hero: {
    greeting: "Hi, I'm",
    tagline: 'Researcher. Developer. Educator. Runner.',
    location: 'Lisbon → Berlin',
    aboutCta: 'About me',
    contactCta: 'Get in touch',
  },
  about: {
    title: 'About',
    subtitle: 'From Lisbon to Berlin — a journey across research, code, education, and running.',
    journeyHeading: 'The Journey',
    journeyP1:
      'I grew up in Lisbon, Portugal, where I studied Computer Science and Informatics Engineering at the University of Lisbon. Under the supervision of <strong>Vasco T. Vasconcelos</strong>, I explored the world of <strong>Session Types</strong> — a type discipline for concurrent and distributed systems that guarantees communication safety by construction.',
    journeyP2:
      'My research was presented at <strong>POPL</strong>, one of the premier venues in programming language theory. This experience shaped how I think about software: types as specifications, programs as proofs, correctness by design.',
    berlinHeading: 'Berlin Chapter',
    berlinP1:
      'In Berlin, I combined my software engineering background with a new calling: <strong>early childhood education</strong>. I\'m currently training as an <em>Erzieher</em> (state-recognized educator) at the <strong>Freie Fachschule Berlin</strong>, while building software for the bilingual Portuguese-German kindergarten <strong>Kita Casa Azul</strong>.',
    berlinP2:
      'On the technical side, I work with <strong>Angular</strong> and <strong>Spring Boot</strong>, building everything from the <strong>Casa Azul Website</strong> to the internal <strong>Dienstplan</strong> (shift planning) application. I also developed the web presence for the <strong>Embassy of Angola in Berlin</strong>.',
    beyondHeading: 'Beyond Work',
    beyondP1:
      "I'm an amateur runner, training through Berlin's seasons. From the Silvesterlauf to the Berlin Marathon, running keeps me grounded and gives structure to everything else.",
  },
  research: {
    title: 'Research',
    subtitle: 'Session Types for safe concurrent programming, under Vasco T. Vasconcelos.',
    profilesHeading: 'Research Profiles',
    abstract:
      'We present a type system for a functional language with multithreading and session-typed communication channels, ensuring communication safety and deadlock freedom.',
  },
  work: {
    title: 'Work',
    subtitle: 'Software projects — Angular, Spring Boot, and the Casa Azul ecosystem.',
  },
  paedagogik: {
    title: 'Pädagogik',
    subtitle: 'Erzieher in Ausbildung at Freie Fachschule Berlin — academic work and presentations.',
    intro:
      "I'm currently completing my training as a state-recognized educator (<em>Erzieher</em>) at the <strong>Freie Fachschule für Sozialpädagogik Berlin</strong>. Below you'll find my academic papers and presentations from the program.",
    tabFacharbeiten: 'Facharbeiten',
    tabPraesentationen: 'Präsentationen',
  },
  running: {
    title: 'Running',
    subtitle: "Training and racing through Berlin's seasons.",
    upcomingHeading: 'Upcoming Races',
    completedHeading: 'Completed',
    stravaButton: 'Follow on Strava',
    upcoming: 'Upcoming',
  },
  contact: {
    title: 'Contact',
    subtitle: "Let's connect — reach out through any of these channels.",
  },
  footer: {
    tagline: 'Researcher. Developer. Educator. Runner.',
    pagesHeading: 'Pages',
    connectHeading: 'Connect',
  },
  common: {
    source: 'Source',
    live: 'Live',
    pdf: 'PDF',
    skipToContent: 'Skip to main content',
    menu: 'Menu',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },
  roleCards: [
    {
      title: 'Researcher',
      description: 'Session Types, POPL, with Vasco Vasconcelos at University of Lisbon.',
    },
    {
      title: 'Developer',
      description: 'Angular + Spring Boot. Building web apps for the Casa Azul ecosystem.',
    },
    {
      title: 'Educator',
      description: 'Erzieher in Ausbildung at Freie Fachschule Berlin.',
    },
    {
      title: 'Runner',
      description: 'Amateur runner training for Berlin races and marathons.',
    },
  ],
  projects: [
    {
      description:
        'Official website for Kita Casa Azul, a bilingual Portuguese-German kindergarten in Berlin. Built with Angular 21, Angular Material, and SSR prerendering.',
    },
    {
      description:
        'Shift-planning application for the Casa Azul kindergarten team. Angular frontend with Spring Boot backend, featuring dark mode and role-based access.',
    },
    {
      description:
        'Web presence for the Embassy of Angola in Berlin. Professional informational site serving the Angolan diaspora community in Germany.',
    },
    {
      description:
        'This personal website — built with Angular 21, Material 3, SSR prerendering, and deployed on GitHub Pages.',
    },
  ],
  facharbeiten: [
    {
      description: 'Written reflection on professional identity as part of the educator training program.',
    },
    {
      description:
        "SOL paper on Bronfenbrenner's ecological systems theory in the context of diverse living environments.",
    },
    {
      description: 'Film reflection and summary on anthroposophy in the context of Waldorf pedagogy.',
    },
    {
      description: 'Revised film reflection and summary on anthroposophy in the context of Waldorf pedagogy.',
    },
  ],
};
