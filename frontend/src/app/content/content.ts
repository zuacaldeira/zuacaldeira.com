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

/** The content the build took from the API before prerendering (D25: scripts/fetch-content.mjs). */
export interface ContentSnapshot {
  readonly home: { readonly hero: Readonly<Record<Language, HomeHero>> };
}

/** Provided in app.config.ts from content.generated.json; specs provide their own. */
export const CONTENT = new InjectionToken<ContentSnapshot>('CONTENT');
