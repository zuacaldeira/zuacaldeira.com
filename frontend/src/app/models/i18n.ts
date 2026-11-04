export type Language = 'en' | 'de' | 'pt';

export const LANGUAGES: Language[] = ['en', 'de', 'pt'];

/** The path of a page in a language, `/de/about`: links inside the site never drop the prefix. */
export function pagePath(lang: Language, page: string): string {
  return `/${lang}/${page}`;
}

/** A link to the page in another language; `current` marks the page's own language. */
export interface LanguageLink {
  lang: Language;
  href: string;
  current: boolean;
}

/** The language links of the page at `url`: the same page in every language (SHELL-02). */
export function languageLinks(url: string): LanguageLink[] {
  // The site root is the English home itself (D1 in home.md).
  const [, here, page] = (url === '/' ? '/en/home' : url).split('/');
  return LANGUAGES.map((lang) => ({
    lang,
    href: pagePath(lang, page),
    current: lang === here,
  }));
}

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
    publicationsHeading: string;
    paperLink: string;
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
  /** The 404 page (D9). `⊥` is notation: the template adds it, the text never holds it. */
  notFound: {
    title: string;
    text: string;
    back: string;
  };
  paper: {
    eyebrow: string;
    kinds: { definition: string; lemma: string; theorem: string; proposition: string };
    read: string;
  };
  projects: { description: string }[];
  facharbeiten: { description: string }[];
}
