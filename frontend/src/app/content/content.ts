import { InjectionToken } from '@angular/core';
import { Language } from '../models/i18n';

/** One language's home hero, as `GET /api/content/home/hero?lang=xx` answers it (D3). */
export interface HomeHero {
  readonly headline: string;
  readonly lede: string;
  readonly workCta: string;
  readonly cvCta: string;
  readonly paperCta: string;
  readonly latticeLabel: string;
  readonly latticeCaption: string;
}

/** One language's head of the Software page, `GET /api/content/software/head?lang=xx` (D11). */
export interface SoftwareHead {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
}

/** One language's lead case study of the Software page (D19); notation between backticks (D18). */
export interface SoftwareLead {
  readonly kicker: string;
  readonly title: string;
  readonly status: string;
  readonly labels: {
    readonly question: string;
    readonly built: string;
    readonly protocol: string;
    readonly live: string;
    readonly result: string;
    readonly stack: string;
  };
  readonly question: string;
  readonly built: string;
  readonly built2: string;
  readonly protocol: string;
  readonly runCaption: string;
  readonly live: string;
  readonly result: string;
  readonly stack: string;
}

/** The home page's text, `@page-content/home` (D21). */
export interface HomeContent {
  readonly hero: Readonly<Record<Language, HomeHero>>;
}

/** The Software page's text, `@page-content/software` (D21). */
export interface SoftwareContent {
  readonly head: Readonly<Record<Language, SoftwareHead>>;
  readonly lead: Readonly<Record<Language, SoftwareLead>>;
}

/** The content the build took from the API before prerendering (D25: scripts/fetch-content.mjs). */
export interface ContentSnapshot {
  readonly home: HomeContent;
  readonly software: SoftwareContent;
}

/**
 * Each page's text, provided by its route from `@page-content/<page>`, so a page downloads only
 * its own (D20, D21); specs provide theirs with `provideTestContent()`.
 */
export const HOME_CONTENT = new InjectionToken<HomeContent>('HOME_CONTENT');
export const SOFTWARE_CONTENT = new InjectionToken<SoftwareContent>('SOFTWARE_CONTENT');
