import { Provider } from '@angular/core';
import { Language } from '../models/i18n';
import {
  ContentSnapshot,
  HOME_CONTENT,
  HomeHero,
  SOFTWARE_CONTENT,
  SoftwareHead,
  SoftwareLead,
} from './content';

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

const softwareLeadIn = (lang: Language): SoftwareLead => ({
  kicker: `kicker ${lang}`,
  title: `title ${lang}`,
  status: `status ${lang}`,
  labels: {
    question: `label question ${lang}`,
    built: `label built ${lang}`,
    protocol: `label protocol ${lang}`,
    live: `label live ${lang}`,
    result: `label result ${lang}`,
    stack: `label stack ${lang}`,
  },
  question: `question ${lang}`,
  built: `built ${lang}`,
  built2: `built2 ${lang}`,
  protocol: `protocol ${lang} \`&{…}\` and \`+{…}\``,
  runCaption: `runCaption ${lang}`,
  live: `\`reticulab serve\` live ${lang}`,
  result: `result ${lang}`,
  stack: 'Python · pytest',
});

const inEvery = <T>(make: (lang: Language) => T): Record<Language, T> => ({
  en: make('en'),
  de: make('de'),
  pt: make('pt'),
});

/** A stand-in for the build's snapshot (D25): every text names its field and language. */
export const TEST_CONTENT: ContentSnapshot = {
  home: { hero: inEvery(heroIn) },
  software: { head: inEvery(softwareHeadIn), lead: inEvery(softwareLeadIn) },
};

export const provideTestContent = (): Provider => [
  { provide: HOME_CONTENT, useValue: TEST_CONTENT.home },
  { provide: SOFTWARE_CONTENT, useValue: TEST_CONTENT.software },
];
