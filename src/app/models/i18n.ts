export type Language = 'en' | 'pt' | 'de' | 'fr';

export const LANGUAGES: Language[] = ['en', 'pt', 'de', 'fr'];

export interface Translations {
  nav: {
    home: string;
    about: string;
    research: string;
    work: string;
    paedagogik: string;
    running: string;
    contact: string;
  };
  hero: {
    greeting: string;
    tagline: string;
    location: string;
    aboutCta: string;
    contactCta: string;
  };
  about: {
    title: string;
    subtitle: string;
    journeyHeading: string;
    journeyP1: string;
    journeyP2: string;
    berlinHeading: string;
    berlinP1: string;
    berlinP2: string;
    beyondHeading: string;
    beyondP1: string;
  };
  research: {
    title: string;
    subtitle: string;
    profilesHeading: string;
    abstract: string;
  };
  work: {
    title: string;
    subtitle: string;
  };
  paedagogik: {
    title: string;
    subtitle: string;
    intro: string;
    tabFacharbeiten: string;
    tabPraesentationen: string;
  };
  running: {
    title: string;
    subtitle: string;
    upcomingHeading: string;
    completedHeading: string;
    stravaButton: string;
    upcoming: string;
  };
  contact: {
    title: string;
    subtitle: string;
  };
  footer: {
    tagline: string;
    pagesHeading: string;
    connectHeading: string;
  };
  common: {
    source: string;
    live: string;
    pdf: string;
    skipToContent: string;
    menu: string;
    closeMenu: string;
    openMenu: string;
  };
  roleCards: { title: string; description: string }[];
  projects: { description: string }[];
  facharbeiten: { description: string }[];
}
