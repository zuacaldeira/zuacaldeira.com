import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

export type Language = 'en' | 'de' | 'pt';

export const LANGUAGES: Language[] = ['en', 'de', 'pt'];

/** Each language's name in that language; the same in every translation. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  pt: 'Português',
};

/** The pages each language has, as the routes name them (`app.routes.ts`). */
export const SITE_PAGES: readonly string[] = ['home', 'about', 'research', 'running', 'contact'];

/** The path of a page in a language, `/de/about`: links inside the site never drop the prefix. */
export function pagePath(lang: Language, page: string): string {
  return `/${lang}/${page}`;
}

/**
 * The router's URL as a signal, after each navigation (`/de/research#main-content`). Call it where
 * `inject()` works, as a field initializer. Used by the language links and the bars' skip link.
 */
export function injectPageUrl(): Signal<string> {
  const router = inject(Router);
  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: router.url },
  );
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
  const path = url.split(/[#?]/)[0];
  const [, here, page] = (path === '/' ? '/en/home' : path).split('/');
  // Not a page of the site: the 404 page leads to the home pages (SHELL-09).
  const found = (LANGUAGES as string[]).includes(here) && SITE_PAGES.includes(page);
  return LANGUAGES.map((lang) => ({
    lang,
    href: pagePath(lang, found ? page : 'home'),
    current: found && lang === here,
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
    /** The words after the notation "⊥ end · ", which the template adds (D30). */
    end: string;
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
    /** The label of the language links' navigation (SHELL-01). */
    language: string;
    /** The label of the main navigation, in the phone menu and the desktop bar (SHELL-08). */
    mainNav: string;
    /** The contact button in the desktop bar (SHELL-05). `⊥` is notation: the template adds it. */
    contactCta: string;
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
