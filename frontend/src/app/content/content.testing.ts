import { Provider } from '@angular/core';
import { Language } from '../models/i18n';
import { CONTENT, ContentSnapshot, HomeHero, SoftwareHead } from './content';

const heroIn = (lang: Language): HomeHero => ({
  headline: `headline ${lang}`,
  lede: `lede ${lang}`,
  workCta: `work ${lang}`,
  cvCta: `cv ${lang}`,
  paperCta: `paper ${lang}`,
  latticeLabel: `label ${lang}`,
  latticeCaption: `caption ${lang}`,
});

const softwareHeadIn = (lang: Language): SoftwareHead => ({
  eyebrow: `eyebrow ${lang}`,
  heading: `heading ${lang}`,
  intro: `intro ${lang}`,
});

/** A stand-in for the build's snapshot (D25): every text names its field and language. */
export const TEST_CONTENT: ContentSnapshot = {
  home: { hero: { en: heroIn('en'), de: heroIn('de'), pt: heroIn('pt') } },
  software: {
    head: { en: softwareHeadIn('en'), de: softwareHeadIn('de'), pt: softwareHeadIn('pt') },
  },
};

export const provideTestContent = (): Provider => ({ provide: CONTENT, useValue: TEST_CONTENT });
