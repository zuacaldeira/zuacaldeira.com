// Acceptance tests for the Software page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/software.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// An element's text as a reader sees it: tags dropped, the entities Angular writes decoded
// (`&` in notation is written `&amp;`), whitespace collapsed.
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const text = (inner) =>
  inner
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();

// The texts of every element with this tag (and, if given, this class), in page order. Angular
// writes its `_ngcontent` attribute before `class`, so the class is looked for anywhere in the tag.
const texts = (html, tag, cls) =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>(.*?)</${tag}>`, 'gs'))]
    .filter(([, attrs]) => !cls || new RegExp(`class="[^"]*\\b${cls}\\b`).test(attrs))
    .map(([, , inner]) => text(inner));

// The page's sections in order, each as its class and inner HTML (sections do not nest here).
const sections = (html) =>
  [...html.matchAll(/<section\b[^>]*class="([^"]*)"[^>]*>(.*?)<\/section>/gs)].map(([, cls, inner]) => ({
    cls,
    inner,
  }));

const lead = (html) => sections(html).find(({ cls }) => cls.split(' ').includes('sw-lead'))?.inner ?? '';

const head = (html) => ({
  eyebrow: texts(html, 'p', 'sw-head__eyebrow'),
  h1: texts(html, 'h1'),
  intro: texts(html, 'p', 'sw-head__intro'),
});

const LANGS = ['en', 'de', 'pt'];

test('SW-PAGE-01: the Software page is built in every language, each with its lang attribute', () => {
  const missing = LANGS.filter((lang) => !existsSync(join(browser, lang, 'software', 'index.html')));
  assert.deepEqual(missing, [], 'languages without a built Software page');
  for (const lang of LANGS) {
    assert.match(page(`${lang}/software`), new RegExp(`<html lang="${lang}"`), `${lang}/software`);
  }
});

test('SW-PAGE-02: the German Software page links to its version in every language, English as default', () => {
  const alternates = [...page('de/software').matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)]
    .map(([, hreflang, href]) => `${hreflang} ${href}`);
  assert.deepEqual(alternates, [
    'en https://zuacaldeira.com/en/software',
    'de https://zuacaldeira.com/de/software',
    'pt https://zuacaldeira.com/pt/software',
    'x-default https://zuacaldeira.com/en/software',
  ]);
});

test('SW-PAGE-03: the Software page is titled "Alexandre Zua Caldeira — Software" in every language (D9)', () => {
  const titles = LANGS.map((lang) => page(`${lang}/software`).match(/<title>(.*?)<\/title>/)?.[1]);
  assert.deepEqual(titles, Array(3).fill('Alexandre Zua Caldeira — Software'));
});

test('SW-HEAD-02: the German Software page opens in German: eyebrow, one <h1>, the intro', () => {
  const html = page('de/software');
  assert.match(html, /<html lang="de"/);
  assert.deepEqual(head(html), {
    eyebrow: ['Ausgewählte Arbeiten'],
    h1: ['Software'],
    intro: [
      'Software, die ich gebaut habe, und wie ich sie an ihr Protokoll binde: zuerst aufgeschrieben, geprüft, dann testgetrieben gebaut.',
    ],
  });
});

test('SW-LEAD-01: the first piece after the head is the TDD monitor, told as a case study', () => {
  const html = page('en/software');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 2),
    ['sw-head', 'sw-lead'],
    'the lead does not follow the head',
  );
  assert.deepEqual(
    {
      kicker: texts(lead(html), 'p', 'sw-lead__kicker'),
      title: texts(lead(html), 'h2'),
      status: texts(lead(html), 'p', 'sw-lead__status'),
    },
    {
      kicker: ['Case study · AI agents'],
      title: ['A monitor that holds a coding agent to its TDD protocol'],
      status: ['In use on this site since November 2026'],
    },
  );
});

// The lead's blocks in order: each label (its <h3>) with the texts of its paragraphs.
const blocks = (html) =>
  [...lead(html).matchAll(/<div\b[^>]*class="sw-lead__block"[^>]*>(.*?)<\/div>/gs)].map(([, inner]) => [
    texts(inner, 'h3')[0],
    texts(inner, 'p'),
  ]);

const EN_BLOCKS = [
  [
    'The question',
    [
      'Does a session type make an AI coding agent’s test-driven work better, and in which mode: in pair with the developer, or in batch on an agreed test list? Better means tests that are meaningful for the work, not coverage.',
    ],
  ],
  [
    'What I built',
    [
      'A monitor that watches a TDD agent as it works, through the agent’s hooks, and checks every step against a session type of the TDD workflow: write a test, run it, see it fail for the right reason, make it pass, refactor, commit. Where a type is given, it refuses a step the type does not allow; otherwise it only observes.',
      'It also reports which parts of the target’s own session types the agent’s tests reach: what the software under test must do, failure paths included.',
    ],
  ],
  [
    'The protocol behind it',
    [
      'What the agent does (&{…}) is kept apart from the results it receives (+{…}). The full workflow type has 56 states and 89 transitions and is a lattice, checked with reticulateP. The variants for sabotage (breaking the code on purpose to show a test bites) and for triangulation are subtypes of it.',
    ],
  ],
  [
    'The live view',
    [
      'reticulab serve, a small read-only web app, follows each session live: what is being built, in plain sentences; the agreed test list, N of M done; the target’s coverage; where the agent is in its type; and a slider to replay the steps.',
    ],
  ],
  [
    'The result',
    [
      'In use on this site since November 2026: every element of its header and footer was built test-first by an agent under the monitor, in pair with me.',
    ],
  ],
  ['Stack', ['Python · pytest · Hypothesis · Server-Sent Events · reticulateP']],
];

test('SW-LEAD-02: the case study answers five questions in order, then gives its stack', () => {
  assert.deepEqual(blocks(page('en/software')), EN_BLOCKS);
});

const leadOf = (html) => ({
  kicker: texts(lead(html), 'p', 'sw-lead__kicker'),
  title: texts(lead(html), 'h2'),
  status: texts(lead(html), 'p', 'sw-lead__status'),
  blocks: blocks(html),
});

const STACK = ['Python · pytest · Hypothesis · Server-Sent Events · reticulateP'];

const TRANSLATED_LEADS = {
  de: {
    kicker: ['Fallstudie · KI-Agenten'],
    title: ['Ein Monitor, der einen Coding-Agenten an sein TDD-Protokoll bindet'],
    status: ['Auf dieser Website im Einsatz seit November 2026'],
    blocks: [
      [
        'Die Frage',
        [
          'Macht ein Session-Typ die testgetriebene Arbeit eines KI-Coding-Agenten besser, und in welchem Modus: im Pair mit dem Entwickler oder im Batch auf einer vereinbarten Testliste? Besser heißt: Tests, die für die Arbeit Bedeutung haben, nicht Abdeckung.',
        ],
      ],
      [
        'Was ich gebaut habe',
        [
          'Ein Monitor, der einem TDD-Agenten über dessen Hooks bei der Arbeit zusieht und jeden Schritt gegen einen Session-Typ des TDD-Ablaufs prüft: Test schreiben, ausführen, aus dem richtigen Grund scheitern sehen, grün machen, refaktorisieren, committen. Ist ein Typ vorgegeben, verweigert er jeden Schritt, den der Typ nicht erlaubt; sonst beobachtet er nur.',
          'Er zeigt auch, welche Teile der Session-Typen des Ziels die Tests des Agenten erreichen: was die getestete Software tun muss, Fehlerpfade eingeschlossen.',
        ],
      ],
      [
        'Das Protokoll dahinter',
        [
          'Was der Agent tut (&{…}), ist getrennt von den Ergebnissen, die er erhält (+{…}). Der vollständige Ablauftyp hat 56 Zustände und 89 Übergänge und ist ein Verband, geprüft mit reticulateP. Die Varianten für Sabotage (den Code absichtlich brechen, um zu zeigen, dass ein Test greift) und für Triangulation sind Subtypen davon.',
        ],
      ],
      [
        'Die Live-Ansicht',
        [
          'reticulab serve, eine kleine Web-App nur zum Lesen, folgt jeder Sitzung live: was gerade gebaut wird, in einfachen Sätzen; die vereinbarte Testliste, N von M erledigt; die Abdeckung des Ziels; wo der Agent in seinem Typ steht; und ein Regler, der die Schritte noch einmal abspielt.',
        ],
      ],
      [
        'Das Ergebnis',
        [
          'Auf dieser Website im Einsatz seit November 2026: Jedes Element ihres Kopf- und Fußbereichs hat ein Agent unter dem Monitor testgetrieben gebaut, im Pair mit mir.',
        ],
      ],
      ['Stack', STACK],
    ],
  },
  pt: {
    kicker: ['Estudo de caso · agentes de IA'],
    title: ['Um monitor que prende um agente de programação ao seu protocolo de TDD'],
    status: ['Em uso neste site desde novembro de 2026'],
    blocks: [
      [
        'A pergunta',
        [
          'Um tipo de sessão torna melhor o trabalho guiado por testes de um agente de programação de IA, e em que modo: em par com o programador, ou em lote, sobre uma lista de testes acordada? Melhor quer dizer testes com significado para o trabalho, não cobertura.',
        ],
      ],
      [
        'O que construí',
        [
          'Um monitor que observa um agente de TDD enquanto trabalha, através dos hooks do agente, e verifica cada passo contra um tipo de sessão do fluxo de TDD: escrever um teste, corrê-lo, vê-lo falhar pela razão certa, pô-lo a passar, refatorar, fazer commit. Quando há um tipo dado, recusa qualquer passo que o tipo não permita; caso contrário, apenas observa.',
          'Mostra também que partes dos tipos de sessão do próprio alvo os testes do agente alcançam: o que o software em teste tem de fazer, incluindo os caminhos de falha.',
        ],
      ],
      [
        'O protocolo por trás',
        [
          'O que o agente faz (&{…}) fica separado dos resultados que recebe (+{…}). O tipo completo do fluxo tem 56 estados e 89 transições e é um reticulado, verificado com o reticulateP. As variantes para sabotagem (partir o código de propósito para mostrar que um teste deteta a falha) e para triangulação são subtipos dele.',
        ],
      ],
      [
        'A vista ao vivo',
        [
          'reticulab serve, uma pequena aplicação web só de leitura, acompanha cada sessão ao vivo: o que está a ser construído, em frases simples; a lista de testes acordada, N de M feitos; a cobertura do alvo; onde o agente está no seu tipo; e um cursor para rever os passos.',
        ],
      ],
      [
        'O resultado',
        [
          'Em uso neste site desde novembro de 2026: cada elemento do seu cabeçalho e rodapé foi construído com os testes primeiro por um agente sob o monitor, em par comigo.',
        ],
      ],
      ['Tecnologias', STACK],
    ],
  },
};

test('SW-LEAD-03: the German and Portuguese case studies are fully translated, the stack as it is', () => {
  assert.deepEqual(
    { de: leadOf(page('de/software')), pt: leadOf(page('pt/software')) },
    TRANSLATED_LEADS,
  );
});

// The checked line of a notation file: like reticulateP's fixture loader, skip `#` lines and
// blank ones, take the first other line (D17).
const checkedLine = (file) =>
  readFileSync(join(import.meta.dirname, '../../docs/notation', file), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'));

const RUN_CAPTIONS = {
  en: 'A line of the workflow type, word for word.',
  de: 'Eine Zeile des Ablauftyps, wörtlich.',
  pt: 'Uma linha do tipo do fluxo, palavra por palavra.',
};

test('SW-LEAD-04: the lead shows the Run line exactly as checked, the same in every language (D5)', () => {
  const checked = checkedLine('run.st');
  assert.equal(checked, 'Run = &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}', 'run.st changed');
  const shown = Object.fromEntries(
    LANGS.map((lang) => {
      const inner = lead(page(`${lang}/software`));
      const pres = [...inner.matchAll(/<pre\b([^>]*)>(.*?)<\/pre>/gs)].map(([, attrs, body]) => ({
        translate: attrs.match(/\btranslate="([^"]*)"/)?.[1],
        text: text(body),
      }));
      // The caption of the Run line's own figure (SessionType), not the lead's other figures.
      const own = [...inner.matchAll(/<figure\b[^>]*class="st"[^>]*>(.*?)<\/figure>/gs)].map(([, f]) => f);
      return [lang, { pres, caption: own.flatMap((f) => texts(f, 'figcaption')) }];
    }),
  );
  assert.deepEqual(
    shown,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        { pres: [{ translate: 'no', text: checked }], caption: [RUN_CAPTIONS[lang]] },
      ]),
    ),
  );
});

test('SW-LEAD-07: the lead gives no figures for the experiment: its only numbers are the date and the type', () => {
  const numbers = Object.fromEntries(
    LANGS.map((lang) => [lang, text(lead(page(`${lang}/software`))).match(/\d+(?:[.,]\d+)?%?/g)]),
  );
  // The status and the result (November 2026), the workflow type's 56 states and 89 transitions.
  const expected = ['2026', '56', '89', '2026'];
  assert.deepEqual(numbers, { en: expected, de: expected, pt: expected });
});

test('SW-LEAD-08: the case study links only to its screenshot files: no lab, no write-up (D2, D23)', () => {
  const links = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      [...lead(page(`${lang}/software`)).matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map(([, href]) => href),
    ]),
  );
  const shots = ['/assets/software/reticulab-live-light.png', '/assets/software/reticulab-live-dark.png'];
  assert.deepEqual(links, { en: shots, de: shots, pt: shots });
});

// The Run figure in a page's lead: the name of its SVG, its role, its labels and its caption.
const runFigure = (html) => {
  const inner = lead(html).match(/<figure\b[^>]*class="[^"]*\bsw-figure\b[^"]*"[^>]*>(.*?)<\/figure>/s)?.[1] ?? '';
  const svg = inner.match(/<svg\b([^>]*)>/)?.[1] ?? '';
  return {
    role: svg.match(/\brole="([^"]*)"/)?.[1],
    name: text(svg.match(/\baria-label="([^"]*)"/)?.[1] ?? ''),
    labels: texts(inner, 'text'),
    caption: texts(inner, 'figcaption'),
  };
};

const FIGURE_NAMES = {
  en: 'The Run step: one action of the agent, three results it receives.',
  de: 'Der Schritt Run: eine Aktion des Agenten, drei Ergebnisse, die er erhält.',
  pt: 'O passo Run: uma ação do agente, três resultados que recebe.',
};

test('SW-LEAD-05: a small drawing shows the one action and its three results, its labels never translated', () => {
  const labels = ['Run', '&{runTest}', '+RED', '+WRONG_RED', '+GREEN', 'Code', 'Fix', 'Green'];
  assert.deepEqual(
    Object.fromEntries(LANGS.map((lang) => [lang, runFigure(page(`${lang}/software`))])),
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        { role: 'img', name: FIGURE_NAMES[lang], labels, caption: [FIGURE_NAMES[lang]] },
      ]),
    ),
  );
});

const SHOTS = {
  en: {
    alt: 'The monitor’s live view while the agent built this site’s redirects for old links: on the left, what is being built, in plain sentences, each marked “passed at once” or “failed first, then passed”; on the right, the agent’s map of its 56-state type, at its end.',
    caption: 'The live view while the agent built this site’s redirects for old links.',
  },
  de: {
    alt: 'Die Live-Ansicht des Monitors, während der Agent die Weiterleitungen alter Links dieser Website baute: links, was gebaut wird, in einfachen Sätzen, jeweils als „sofort bestanden“ oder „erst gescheitert, dann bestanden“ markiert; rechts die Karte des Agenten in seinem Typ mit 56 Zuständen, an dessen Ende.',
    caption: 'Die Live-Ansicht, während der Agent die Weiterleitungen alter Links dieser Website baute.',
  },
  pt: {
    alt: 'A vista ao vivo do monitor enquanto o agente construía os redirecionamentos de ligações antigas deste site: à esquerda, o que está a ser construído, em frases simples, cada uma marcada como «passou à primeira» ou «falhou primeiro, depois passou»; à direita, o mapa do agente no seu tipo de 56 estados, no fim.',
    caption: 'A vista ao vivo enquanto o agente construía os redirecionamentos de ligações antigas deste site.',
  },
};

test('SW-LEAD-06: the lead holds the light and the dark screenshot, with the page language’s alt text', () => {
  const shots = Object.fromEntries(
    LANGS.map((lang) => {
      const inner = lead(page(`${lang}/software`)).match(/<figure\b[^>]*class="sw-shot"[^>]*>(.*?)<\/figure>/s)?.[1] ?? '';
      const images = [...inner.matchAll(/<img\b([^>]*)>/g)].map(([, attrs]) => ({
        src: attrs.match(/\ssrc="([^"]*)"/)?.[1],
        alt: text(attrs.match(/\salt="([^"]*)"/)?.[1] ?? ''),
        loading: attrs.match(/\sloading="([^"]*)"/)?.[1],
      }));
      return [lang, { images, caption: texts(inner, 'figcaption') }];
    }),
  );
  const image = (lang, mode) => ({
    src: `/assets/software/reticulab-live-${mode}.png`,
    alt: SHOTS[lang].alt,
    loading: 'lazy',
  });
  assert.deepEqual(
    shots,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        { images: [image(lang, 'light'), image(lang, 'dark')], caption: [SHOTS[lang].caption] },
      ]),
    ),
  );
  for (const mode of ['light', 'dark']) {
    assert.ok(existsSync(join(browser, `assets/software/reticulab-live-${mode}.png`)), `${mode} is not built`);
  }
});

// The "More work" section of a page: its heading and its rows, each an <article>.
const work = (html) => sections(html).find(({ cls }) => cls.split(' ').includes('sw-work'))?.inner ?? '';
const workRows = (html) =>
  [...work(html).matchAll(/<article\b[^>]*>(.*?)<\/article>/gs)].map(([, row]) => ({
    kicker: texts(row, 'p', 'sw-work__kicker')[0],
    title: texts(row, 'h3')[0],
    text: texts(row, 'p', 'sw-work__text')[0],
    stack: texts(row, 'p', 'sw-work__stack')[0],
  }));

const EN_ROWS = [
  {
    kicker: 'Verification tool',
    title: 'reticulateP',
    text: 'Builds the state space of a session type and checks that it forms a lattice. It turned the ICE 2026 paper’s 108 benchmark protocols into lattices, is one of the paper’s two independent tool implementations, and checks every session type on this site.',
    stack: 'Python',
  },
  {
    kicker: 'Web application',
    title: 'Kita Dienstplan',
    text: 'Shift planning for the team of Kita Casa Azul, a bilingual Portuguese-German kindergarten in Berlin: an Angular front end and a Spring Boot back end, with role-based access.',
    stack: 'Angular · Spring Boot · Java · PostgreSQL',
  },
  {
    kicker: 'Website',
    title: 'Casa Azul website',
    text: 'The website of Kita Casa Azul, the bilingual Portuguese-German kindergarten in Berlin, prerendered with Angular so every page loads as plain HTML.',
    stack: 'Angular · Angular Material · SSR prerendering · TypeScript',
  },
];

test('SW-WORK-01: three more pieces follow the lead, in a fixed order', () => {
  const html = page('en/software');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 3),
    ['sw-head', 'sw-lead', 'sw-work'],
    'More work does not follow the lead',
  );
  assert.deepEqual({ heading: texts(work(html), 'h2'), rows: workRows(html) }, { heading: ['More work'], rows: EN_ROWS });
});

const TRANSLATED_WORK = {
  de: {
    heading: ['Weitere Arbeiten'],
    rows: [
      {
        kicker: 'Verifikationswerkzeug',
        title: 'reticulateP',
        text: 'Baut den Zustandsraum eines Session-Typs und prüft, ob er einen Verband bildet. Es hat die 108 Benchmark-Protokolle des ICE-2026-Papers in Verbände übersetzt, ist eine der beiden unabhängigen Werkzeug-Implementierungen des Papers und prüft jeden Session-Typ auf dieser Website.',
        stack: EN_ROWS[0].stack,
      },
      {
        kicker: 'Webanwendung',
        title: 'Kita Dienstplan',
        text: 'Dienstplanung für das Team der Kita Casa Azul, einer zweisprachigen portugiesisch-deutschen Kita in Berlin: ein Angular-Frontend und ein Spring-Boot-Backend, mit rollenbasiertem Zugriff.',
        stack: EN_ROWS[1].stack,
      },
      {
        kicker: 'Website',
        title: 'Website der Casa Azul',
        text: 'Die Website der Kita Casa Azul, der zweisprachigen portugiesisch-deutschen Kita in Berlin, mit Angular vorgerendert, sodass jede Seite als reines HTML lädt.',
        stack: EN_ROWS[2].stack,
      },
    ],
  },
  pt: {
    heading: ['Outros trabalhos'],
    rows: [
      {
        kicker: 'Ferramenta de verificação',
        title: 'reticulateP',
        text: 'Constrói o espaço de estados de um tipo de sessão e verifica que forma um reticulado. Transformou em reticulados os 108 protocolos de referência do artigo ICE 2026, é uma das duas implementações independentes do artigo e verifica cada tipo de sessão deste site.',
        stack: EN_ROWS[0].stack,
      },
      {
        kicker: 'Aplicação web',
        title: 'Kita Dienstplan',
        text: 'Planeamento de turnos para a equipa da Kita Casa Azul, um jardim de infância bilingue português-alemão em Berlim: frontend em Angular e backend em Spring Boot, com acesso por funções.',
        stack: EN_ROWS[1].stack,
      },
      {
        kicker: 'Site',
        title: 'Site da Casa Azul',
        text: 'O site da Kita Casa Azul, o jardim de infância bilingue português-alemão em Berlim, pré-renderizado com Angular, para que cada página carregue como HTML simples.',
        stack: EN_ROWS[2].stack,
      },
    ],
  },
};

test('SW-WORK-05: the rows are translated; the names and the stacks are not', () => {
  const shown = (lang) => ({ heading: texts(work(page(`${lang}/software`)), 'h2'), rows: workRows(page(`${lang}/software`)) });
  assert.deepEqual({ de: shown('de'), pt: shown('pt') }, TRANSLATED_WORK);
});

// "How I work": its heading, and its steps (the <li> of its <ol>) as title and sentence.
const how = (html) => sections(html).find(({ cls }) => cls.split(' ').includes('sw-how'))?.inner ?? '';
const howOf = (html) => ({
  heading: texts(how(html), 'h2'),
  steps: [...(how(html).match(/<ol\b[^>]*>(.*?)<\/ol>/s)?.[1] ?? '').matchAll(/<li\b[^>]*>(.*?)<\/li>/gs)].map(
    ([, step]) => [texts(step, 'h3')[0], texts(step, 'p', 'sw-how__text')[0]],
  ),
});

test('SW-HOW-01: three steps say how the work is done, after More work', () => {
  const html = page('en/software');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 4),
    ['sw-head', 'sw-lead', 'sw-work', 'sw-how'],
    'How I work does not follow More work',
  );
  assert.deepEqual(howOf(html), {
    heading: ['How I work'],
    steps: [
      ['Protocol first', 'The behaviour is agreed as examples and written as a session type before any code exists.'],
      [
        'Test-first, one step at a time',
        'Each test is seen to fail for the right reason, then made to pass; then the code is tidied and committed.',
      ],
      [
        'Every forbidden path shown red',
        'What the protocol rules out gets a test too, and each such test is broken once on purpose, to prove it bites.',
      ],
    ],
  });
});

const PAPER = '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf';
const REPO = { en: 'Repository', de: 'Repository', pt: 'Repositório' };
const READ_PAPER = { en: 'Read the paper (PDF)', de: 'Paper lesen (PDF)', pt: 'Ler o artigo (PDF)' };

test('SW-WORK-02 to 04: the paper for reticulateP, the repositories and the live site, in every language', () => {
  const links = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      [...work(page(`${lang}/software`)).matchAll(/<article\b[^>]*>(.*?)<\/article>/gs)].map(([, row]) =>
        [...row.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>(.*?)<\/a>/gs)].map(([, href, label]) => `${text(label)} → ${href}`),
      ),
    ]),
  );
  assert.deepEqual(
    links,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        [
          [`${READ_PAPER[lang]} → ${PAPER}`],
          [`${REPO[lang]} → https://github.com/zuacaldeira/kita-dienstplan`],
          ['casa-azul-berlin.de → https://casa-azul-berlin.de', `${REPO[lang]} → https://github.com/zuacaldeira/ca-website`],
        ],
      ]),
    ),
  );
  assert.ok(existsSync(join(browser, PAPER)), 'the paper is not in the build');
});

// The scripts a page loads at once: its <script src> and modulepreload files, and every file they
// import statically, followed through (`import("…")` is loaded later, so it is left out).
const loadedAtOnce = (route) => {
  const html = page(route);
  const queue = [...html.matchAll(/<script src="([^"]+\.js)"|<link rel="modulepreload" href="([^"]+\.js)"/g)].map(
    ([, src, href]) => src ?? href,
  );
  const seen = new Set();
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    const code = readFileSync(join(browser, file), 'utf8');
    for (const [, imported] of code.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) queue.push(imported);
  }
  return [...seen];
};

const holding = (route, sentence) =>
  loadedAtOnce(route).filter((file) => readFileSync(join(browser, file), 'utf8').includes(sentence));

test('SW-PAGE-14 (D20): each page downloads only its own text', () => {
  // Its own text is there, so the files read are the ones that hold page text.
  assert.notDeepEqual(holding('en/home', 'I build software, and prove its protocols hold.'), []);
  assert.notDeepEqual(holding('en/software', 'A monitor that holds a coding agent to its TDD protocol'), []);
  assert.deepEqual(
    {
      // ASCII only: the minifier escapes characters such as `·` in the scripts.
      home: holding('en/home', 'A monitor that holds a coding agent to its TDD protocol'),
      software: holding('en/software', 'I build software, and prove its protocols hold.'),
    },
    { home: [], software: [] },
  );
});

for (const [id, lang, eyebrow, intro] of [
  [
    'SW-HEAD-01',
    'en',
    'Selected work',
    'Software I have built, and how I hold it to its protocol: written down first, checked, then built test-first.',
  ],
  [
    'SW-HEAD-03',
    'pt',
    'Trabalhos selecionados',
    'Software que construí, e como o prendo ao seu protocolo: primeiro escrito, depois verificado, depois construído com os testes primeiro.',
  ],
]) {
  test(`${id}: the ${lang} Software page opens with its eyebrow, one <h1> and the intro`, () => {
    assert.deepEqual(head(page(`${lang}/software`)), { eyebrow: [eyebrow], h1: ['Software'], intro: [intro] });
  });
}
