import { Provider } from '@angular/core';
import { Language } from '../models/i18n';
import {
  ContentSnapshot,
  HOME_CONTENT,
  HomeHero,
  SHARED_CONTENT,
  SharedPaper,
  SOFTWARE_CONTENT,
  PageHead,
  SoftwareHow,
  SoftwareLead,
  SoftwareWork,
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

const softwareHeadIn = (lang: Language): PageHead => ({
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
  figure: `figure ${lang}`,
  shotAlt: `shotAlt ${lang}`,
  shotCaption: `shotCaption ${lang}`,
});

const softwareWorkIn = (lang: Language): SoftwareWork => ({
  heading: `work heading ${lang}`,
  rows: [
    {
      id: 'first',
      kicker: `kicker first ${lang}`,
      title: 'First',
      text: `text first ${lang}`,
      stack: 'Python',
      links: [{ label: `paper ${lang}`, href: '/assets/pdfs/paper.pdf' }],
    },
    {
      id: 'second',
      kicker: `kicker second ${lang}`,
      title: `Second ${lang}`,
      text: `text second ${lang}`,
      stack: 'Angular · Java',
      links: [
        { label: 'example.org', href: 'https://example.org' },
        { label: `repo ${lang}`, href: 'https://github.com/example/second' },
      ],
    },
  ],
});

const softwareHowIn = (lang: Language): SoftwareHow => ({
  heading: `how heading ${lang}`,
  steps: [1, 2, 3].map((n) => ({ title: `step ${n} ${lang}`, text: `sentence ${n} ${lang}` })),
  caption: `how caption ${lang}`,
});

const sharedPaperIn = (lang: Language): SharedPaper => ({
  eyebrow: `eyebrow ${lang}`,
  paperTitle: 'Paper Title',
  year: 2026,
  theorem: `theorem ${lang}`,
  definition: `definition ${lang}`,
  lemma: `lemma ${lang}`,
  proposition: `proposition ${lang}`,
  evidence: `evidence ${lang}`,
  read: `read ${lang}`,
  allResearch: `all research ${lang}`,
  more: `more ${lang}`,
  pdfUrl: '/assets/pdfs/paper.pdf',
  statements: [{ kind: 'theorem', number: 15, name: 'Name', text: 'For every S, a statement.' }],
});

const inEvery = <T>(make: (lang: Language) => T): Record<Language, T> => ({
  en: make('en'),
  de: make('de'),
  pt: make('pt'),
});

/** A stand-in for the build's snapshot (D25): every text names its field and language. */
export const TEST_CONTENT: ContentSnapshot = {
  home: { hero: inEvery(heroIn) },
  software: {
    head: inEvery(softwareHeadIn),
    lead: inEvery(softwareLeadIn),
    work: inEvery(softwareWorkIn),
    how: inEvery(softwareHowIn),
    proof: inEvery((lang) => ({ kicker: `proof kicker ${lang}` })),
  },
  shared: { paper: inEvery(sharedPaperIn) },
};

export const provideTestContent = (): Provider => [
  { provide: HOME_CONTENT, useValue: TEST_CONTENT.home },
  { provide: SOFTWARE_CONTENT, useValue: TEST_CONTENT.software },
  { provide: SHARED_CONTENT, useValue: TEST_CONTENT.shared },
];
