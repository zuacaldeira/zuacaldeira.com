import { Provider } from '@angular/core';
import { CONTENT, ContentSnapshot, HomeHero, SiteLanguage } from './content';

const heroIn = (lang: SiteLanguage): HomeHero => ({
  headline: `headline ${lang}`,
  lede: `lede ${lang}`,
  workCta: `work ${lang}`,
  cvCta: `cv ${lang}`,
  paperCta: `paper ${lang}`,
  latticeLabel: `label ${lang}`,
  latticeCaption: `caption ${lang}`,
});

/** A stand-in for the build's snapshot (D25): every text names its field and language. */
export const TEST_CONTENT: ContentSnapshot = {
  home: { hero: { en: heroIn('en'), de: heroIn('de'), pt: heroIn('pt') } },
};

export const provideTestContent = (): Provider => ({ provide: CONTENT, useValue: TEST_CONTENT });
