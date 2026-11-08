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

/**
 * One language's page head, `GET /api/content/<page>/head?lang=xx` (D11 in software.md), for the
 * Software and Writing pages (D13 in writing.md).
 */
export interface PageHead {
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
  /** The Run figure's name and caption (D22). */
  readonly figure: string;
  readonly shotAlt: string;
  readonly shotCaption: string;
}

/** A link of a piece of work: inside the site (a file) or outside it (D26, D27). */
export interface WorkLink {
  readonly label: string;
  readonly href: string;
}

/** One piece of "More work" (D26): names, stacks and targets are the same in every language. */
export interface WorkRow {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly text: string;
  readonly stack: string;
  readonly links: readonly WorkLink[];
}

/** One language's "More work" of the Software page, its rows in the page's order (D26). */
export interface SoftwareWork {
  readonly heading: string;
  readonly rows: readonly WorkRow[];
}

/** One language's "How I work" (D28): three steps in the page's order, and the type's caption. */
export interface SoftwareHow {
  readonly heading: string;
  readonly steps: readonly { readonly title: string; readonly text: string }[];
  readonly caption: string;
}

/** A statement quoted from the paper: notation, the same in every language (HOME-PAPER-04, D31). */
export interface PaperStatement {
  /** `theorem`, `definition`, `lemma` or `proposition`; a string, as the snapshot's JSON types it. */
  readonly kind: string;
  readonly number: number;
  readonly name?: string;
  readonly text: string;
}

/** One language's labels of the paper, shared by pages (`shared/paper`, HOME-PAPER-09, D30). */
export interface SharedPaper {
  readonly eyebrow: string;
  readonly paperTitle: string;
  readonly year: number;
  readonly theorem: string;
  readonly definition: string;
  readonly lemma: string;
  readonly proposition: string;
  readonly evidence: string;
  readonly read: string;
  readonly allResearch: string;
  readonly more: string;
  readonly pdfUrl: string;
  readonly statements: readonly PaperStatement[];
}

/** Text several pages read, `@page-content/shared` (D30). */
export interface SharedContent {
  readonly paper: Readonly<Record<Language, SharedPaper>>;
}

/** The home page's text, `@page-content/home` (D21). */
export interface HomeContent {
  readonly hero: Readonly<Record<Language, HomeHero>>;
}

/** The Software page's text, `@page-content/software` (D21). */
export interface SoftwareContent {
  readonly head: Readonly<Record<Language, PageHead>>;
  readonly lead: Readonly<Record<Language, SoftwareLead>>;
  readonly work: Readonly<Record<Language, SoftwareWork>>;
  readonly how: Readonly<Record<Language, SoftwareHow>>;
  /** The proof band's own line (D30). */
  readonly proof: Readonly<Record<Language, { readonly kicker: string }>>;
}

/** An author of a text, as published; `self` marks the site's author (WR-LIST-03). */
export interface TextAuthor {
  readonly name: string;
  readonly self?: boolean;
}

/**
 * One text of the Writing page (D11, D15 in writing.md): all but the note is the same in every
 * language. A link inside the site reads the list's `read`; one outside reads its own `label`.
 */
export interface WritingText {
  readonly id: string;
  readonly year: number;
  /** `workshop`, `conference` or `report`; a string, as the snapshot's JSON types it. */
  readonly kind: string;
  readonly title: string;
  readonly authors: readonly TextAuthor[];
  readonly venue: string;
  readonly note?: string;
  readonly href: string;
  readonly label?: string;
  readonly external: boolean;
}

/** One language's list of the Writing page, `writing/texts` (D11 in writing.md). */
export interface WritingTexts {
  readonly inEnglish: string;
  readonly read: string;
  readonly newTab: string;
  readonly kinds: Readonly<Record<string, string>>;
  readonly items: readonly WritingText[];
}

/** The Writing page's text, `@page-content/writing` (D21 in software.md; writing.md). */
export interface WritingContent {
  readonly head: Readonly<Record<Language, PageHead>>;
  readonly texts: Readonly<Record<Language, WritingTexts>>;
}

/** The content the build took from the API before prerendering (D25: scripts/fetch-content.mjs). */
export interface ContentSnapshot {
  readonly home: HomeContent;
  readonly software: SoftwareContent;
  readonly writing: WritingContent;
  readonly shared: SharedContent;
}

/**
 * Each page's text, provided by its route from `@page-content/<page>`, so a page downloads only
 * its own (D20, D21); specs provide theirs with `provideTestContent()`.
 */
export const HOME_CONTENT = new InjectionToken<HomeContent>('HOME_CONTENT');
export const SOFTWARE_CONTENT = new InjectionToken<SoftwareContent>('SOFTWARE_CONTENT');
export const WRITING_CONTENT = new InjectionToken<WritingContent>('WRITING_CONTENT');
/** Text several pages read, provided by each route that needs it (D30). */
export const SHARED_CONTENT = new InjectionToken<SharedContent>('SHARED_CONTENT');
