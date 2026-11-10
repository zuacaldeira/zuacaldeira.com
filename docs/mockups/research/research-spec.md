# Build spec: Research page

> **Changed on 2026-11-10 (D26 in `docs/examples/research.md`):** the wall and its rung note have
> left the page. The head is the plain shared head of Software and Writing, and nothing on the page
> moves. What this spec says about the wall, its motion and its texts is kept as the record of
> option A only.

Chosen on 2026-11-08 and 2026-11-09: **a landing page for the ICE 2026 paper** (R1 b) **with
option A, the wall in the head** (R4 replaced, 2026-11-09), and the section colours and motion
shared by the options. Answers R1 to R8 and Q1 to Q5 in `docs/examples/research.md`. Visual
reference: `research.html` beside this file at `#opt=a`, or `index.html` to switch language and
theme; screenshots in `screenshots/` (`opt-a-*`, `motion-a-*`). Options B and C stay in the mock-up
for comparison and are not built; C's filter is not planned. Mock-ups are not production code: do
not copy their markup. The behaviour is in `docs/examples/research.md`, built test-first.

## Purpose
The menu's Research link (SHELL-11), the lattice's `research` atom (HOME-HERO-09) and "All research"
on the theorem bands (SW-PROOF-02, HOME-PAPER-08) lead here. The page presents one paper, *Session
Type State Spaces Form Lattices* (ICE 2026): what it proves, how it was checked, and the tool behind
it. Its visual idea is the paper's own corpus: the 74 distinct lattices of its benchmark protocols,
tiled as an azulejo panel beside the heading (the design direction's "the Hasse diagram and the tile
are the same drawing"). The full list of texts is the Writing page's; this page links there once.
Readers, from `docs/design.md`:
- **Researchers and reviewers** (laptop, often from the band, so they have seen Theorem 15): the
  abstract, all four results, the evidence, the PDF, and the corpus drawn.
- **Hiring managers** (phone, a minute): a first screen that shows the work, not only says it.
- **Teams building AI agents:** why the protocols hold, and the tool that checks them.

## Sections, in order
1. **Head, with the wall:** `PageHead`'s eyebrow, `<h1>` "Research" (Q1 a) and intro on the left;
   on the right the wall: the 74 R2′ lattices as one tile panel, its caption, and a pointer hint.
   On a phone the wall follows the intro.
2. **The paper:** one card on the surface with its ochre top. Left: year · kind, `<h2>` title,
   author, venue, note, the PDF button. Right: the abstract, labelled, quoted in English (R2).
3. **What it proves,** on the theorem band: `<h2>`; Theorem 15 in display type; then Definition 6,
   Lemma 8, Proposition 18 in a row of three, all open (R3).
4. **How it was checked:** `<h2>`; four figures (108, 93, 15, Lean 4) as a `<dl>`, the "15" under an
   ochre rule; the evidence sentence the bands use; then the rung note, which tells the paper's
   count from the wall's.
5. **The tool,** on the raised glaze: `<h2>`; reticulateP in the Software page's row style.
6. **More research:** "Earlier papers (2007–2010)" to Writing, and ResearchGate (R5, R7; Q2, Q3).
7. **Footer:** the shared footer, unchanged.

Not built now:
- **What's next** (R6): left out while it has no text (D1). It comes back as its own change
  (`research/next`, `{heading, text}`, between 5 and 6), without the mock-up's placeholder frame.
- **The BICA screenshot** (an IDE plugin marking an out-of-order call): left out until Zua sends the
  image (D10). Then it joins "The tool" as a figure beside reticulateP, with its alt text and caption
  in en, de and pt, as its own change. The mock-up's dashed frame is never built.
- **Cite** (Q5 a): with the EPTCS details, as its own change.

The header is the shared one; its Research link is current (`aria-current="page"`). There is no
theorem band at the end: the page's own results section takes the band's colours instead.

## Layout per width
One column of 1200 px, gutter 24 px (16 px under `Handset`). Sections are
`padding-block: clamp(40px, 6vw, 80px)`.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Head | Eyebrow, `<h1>`, intro, then the wall full width, caption, hint | The same | Two columns: text `1fr`, wall `minmax(0, 520px)`, gap `clamp(32px, 5vw, 72px)`, centred vertically |
| The paper | One column: meta, button full width, then a rule and the abstract | One column | Two columns `1fr` / `1.35fr`, a rule between |
| What it proves | Theorem; the three stacked | Stacked | Theorem up to 52 rem; the three in three columns under a rule |
| How it was checked | Figures 2 × 2; evidence; rung note | 2 × 2 | Four in a row; text at 65 ch |
| The tool | One column | One column | One column (two once the BICA figure exists) |
| More research | Links stacked | One line, wrapping | One line |

The one-column switch is at 900 px. The wall is 10 tiles wide at every width (8 rows, the last of
4 centred), so it is 520 × 416 px at 1440 and about 358 × 286 px at 390. Measured in the mock-up
(`screenshots/checks.txt`, option A, with the What's next placeholder and the BICA frame, which are
not built): 4,546 px at 390 (en), 4,734 (de); 3,532 at 1440 (en), 3,577 (de).

## Components
- **Header, footer, language links, theme button, phone menu, `PageHead`:** existing. The head here
  adds the wall beside `PageHead`'s three texts: `PageHead` takes projected content for its right
  column, or the Research page lays out its own head with the same styles; either way the styles are
  shared, not copied.
- **New, `ResearchWall`** (`pages/research/research-wall/`): a `<figure>` with
  - the SVG, **generated at build-preparation time** by `scripts/lattice-wall/render.py` from
    `lattices.json` (D8): `viewBox="0 0 1000 800"`, no crop (`xMidYMid meet`), `role="img"`,
    `aria-label` the stored `wall.label`; tiles in render.py's order (states, then edges), each a
    `<g class="t">` or `<g class="t nd">` with `data-name` (the class's representative protocol, never
    translated), a `<rect>` cell, its edges as `<line pathLength="1">` and its states as `<circle>`
    (⊤ and ⊥ larger), each line and circle with `style="--d: Ns"`, N = tile index × 0.012 s;
  - the caption `<figcaption>` (`wall.caption`, Plex Mono 0.75 rem, `--zc-text-muted`, max 60 ch,
    "Ochre: not distributive" in `--zc-ochre-text` 500);
  - the hint `<p aria-hidden="true">` (Plex Mono 0.75 rem, `--zc-text-body`), filled by the script.
  - Colours: cells `--grout` hairline on a `color-mix(--zc-bg-warm 85%)` ground, so the head's tile
    pattern shows faintly; edges and states `--zc-edge` (3:1), non-distributive `--zc-ochre` (3:1);
    ⊤ and ⊥ circles r 2.6 with a `--zc-bg-warm` ring, the others r 1.6; the pointed tile's lines 2.6
    wide.
- **New, `PaperCard`** (`pages/research/paper-card/`): an `<article>` on `--zc-bg-white`, 1 px
  `--zc-border-light` border, a 3 px `--zc-ochre` top, padding `clamp(24px, 3vw, 40px)` (16 px under
  480 px).
  - Year · kind: Plex Mono 0.8125 rem; year 500 in `--zc-text-heading`, kind in `--zc-ochre-text`.
  - Title: `<h2>`, Fraunces 600, `clamp(1.75rem, 3.4vw, 2.6rem)`, `text-wrap: balance`,
    `translate="no"`, `lang="en"` on de and pt.
  - Author: Archivo 0.9375 rem, in `<b>` 600 (the only author), `translate="no"`.
  - Venue: Plex Mono 0.8125 rem, `--zc-text-muted`, `overflow-wrap: anywhere`, `translate="no"`.
  - Note: as on the Writing page (ochre lozenge, Plex Mono 0.8125 rem).
  - Button: the site's filled button (`--zc-azul`, `--zc-on-accent`, min 44 px), to the PDF, same
    tab, `hreflang="en"`, `type="application/pdf"`. Never a Material button (the teal trap).
  - Abstract: an `<h3>` label (Plex Mono 0.8125 rem, `--zc-ochre-text`); on de and pt the language
    line ("Auf Englisch", "Em inglês"; Plex Mono, `--zc-text-muted`); then a `<blockquote>`,
    `translate="no"`, `lang="en"` on de and pt, Archivo 1 rem, line height 1.65, max 65 ch.
- **New, `PaperResults`** (`pages/research/paper-results/`), **on the theorem band:** background
  `--zc-band-bg`, text and labels `--zc-band-fg` (the band's tokens, D32 in `software.md`: the accent
  with on-accent text in light, the raised glaze with heading text in dark), focus outline
  `--zc-band-fg`. The section's `<h2>`; a `<blockquote>` for each statement, its label a `<p>` in Plex
  Mono 0.875 rem (kind word, number, " · ", the name with `translate="no"`), its text a `<p>` with
  `translate="no"` and `lang="en"` on de and pt. Theorem: Fraunces 400, `clamp(1.6rem, 3.2vw,
  2.5rem)`, line height 1.2, max 52 rem. The three others: Fraunces 1.0625 rem, line height 1.5, in a
  grid under a rule of `--zc-band-fg` at 40 %. Plain texts (D4).
- **New, `PaperChecks`** (`pages/research/paper-checks/`): `<h2>`; a `<dl>`, each figure a `<div>`
  with a 3 px top rule, `--zc-azul`, and `--zc-ochre` for the figure 15 (not distributive, the wall's
  ochre); `<dt>` the value (Plex Mono 500, `clamp(2rem, 4vw, 3rem)`, `translate="no"`), `<dd>` the
  label (Archivo 0.9375 rem); then the evidence `<p>` and the rung note `<p>` (`checked.rung`), each
  1.0625 rem, max 65 ch. The meaning is in the words, not the colour.
- **The tool section** on `--zc-bg-light`, no rule above it: the Software page's `WorkRows` row style
  (kicker, `<h3>` title, text, stack, a link); reuse the row's styles or component, do not copy. Its
  link is inside the site, same tab, no `↗`.
- **The closing row:** a `<section>` with a small `<h2>` (Plex Mono 0.8125 rem, uppercase,
  `--zc-text-muted`) above a `<ul>` of two links, each min 44 px; ResearchGate as Writing's outside
  links (new tab, `rel="noopener noreferrer"`, `↗` hidden, the hidden new-tab words).
- **Section grounds, top to bottom:** head on `--zc-bg-warm` with the lozenge tile (`--grout`); paper
  on `--zc-bg-warm`, its card `--zc-bg-white`; results `--zc-band-bg`; checks `--zc-bg-warm`; tool
  `--zc-bg-light`; closing row `--zc-bg-warm`; footer the shell's. Sections on the same ground are
  parted by a `--zc-border-light` rule; a change of ground needs none.

## Motion and interaction
- **The wall draws in,** smallest lattice first (two-element chain to the 78-state Raft Leader
  Election), when it first comes into view: each line's `stroke-dashoffset` from 1 to 0 over 0.7 s,
  each state fading in over 0.4 s, delayed by its tile's `--d`; the whole wall is drawn within about
  1.6 s. The order is the meaning: the corpus grows from chains to lozenges to dense products.
- **Only with JavaScript and without reduced motion.** The script adds `motion` to `<html>` when
  `prefers-reduced-motion: reduce` does not match, and an `IntersectionObserver` adds `in` to the
  wall at 25 % visible. The hiding rules apply only under `html.motion .draw:not(.in)`, so the
  prerendered page, a page without JavaScript, and a page with reduced motion all show the wall
  complete at once. Under reduced motion no transition runs.
- **Pointing names the protocol:** pointer over a tile thickens its lines and puts its
  `data-name` in the hint; leaving the wall restores the hint's sentence. A pointer extra, not
  information: the wall is one image to screen readers (its label gives the counts), and the
  hint is `aria-hidden`. A tap on a phone does the same. No tile is focusable.
- No other motion on the page. The hero's flickering tile (`LatticeWall` on the home page) is not
  used here.

## Content
Text comes from the content API through the build's snapshot: page `research`
(`@page-content/research`, `RESEARCH_CONTENT`) for its own text, page `shared` (`SHARED_CONTENT`)
for what the bands share (D2). The wall's drawing comes from `lattices.json` through render.py, not
from the API (D8).

Sections of `research` (D2, with `wall` and `checked.rung` added for option A):
- `head`: `{eyebrow, heading, intro}`; the title is `Alexandre Zua Caldeira — ${heading}`.
- `wall`: `{label, caption, hint}`.
- `paper`: `{kind, note, inEnglish, abstractLabel, author, venue, abstract}`.
- `results`: `{heading}`.
- `checked`: `{heading, figures: [{value, label}] × 4, rung}`.
- `tool`: `{heading, kicker, title, text, stack, link: {label, href}}`.
- `more`: `{heading, earlier, newTab, researchGate: {label, href}}`.

`shared/paper.statements` holds the four statements (D3).

### Copy (en / de / pt)
Drafts are built as drafted and listed for the developer's review on the preview (Q4), as the
Writing page's D9.

| Key | en | de | pt |
|-----|----|----|----|
| `title` | Alexandre Zua Caldeira — Research | Alexandre Zua Caldeira — Forschung | Alexandre Zua Caldeira — Investigação |
| `head.eyebrow` | One paper · ICE 2026 | Ein Paper · ICE 2026 | Um artigo · ICE 2026 |
| `head.heading` | Research | Forschung | Investigação |
| `head.intro` | The state space of every well-formed session type forms a lattice. This page is the paper that proves it: what it shows, how it was checked, and the tool behind it. | Der Zustandsraum jedes wohlgeformten Session-Typs bildet einen Verband. Diese Seite stellt das Paper vor, das es beweist: was es zeigt, wie es geprüft wurde und das Werkzeug dahinter. | O espaço de estados de todo o tipo de sessão bem formado forma um reticulado. Esta página apresenta o artigo que o prova: o que mostra, como foi verificado e a ferramenta por trás dele. |
| `wall.label` | The 74 distinct lattices of the paper’s benchmark protocols at rung R2′, ordered by size; the 47 that are not distributive in ochre. | Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′, nach Größe geordnet; die 47 nicht distributiven in Ocker. | Os 74 reticulados distintos dos protocolos de referência do artigo no nível R2′, por tamanho; os 47 não distributivos a ocre. |
| `wall.caption` | 74 distinct lattices, drawn from 104 of the paper’s 108 protocols at rung R2′, a finer construction than the paper’s own. Ochre: not distributive, 47 of the 74. | 74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf Stufe R2′, einer feineren Konstruktion als der des Papers. Ocker: nicht distributiv, 47 der 74. | 74 reticulados distintos, desenhados a partir de 104 dos 108 protocolos do artigo no nível R2′, uma construção mais fina do que a do artigo. Ocre: não distributivos, 47 dos 74. |
| `wall.hint` | Point at a tile to name its protocol. | Zeigen Sie auf eine Kachel, um ihr Protokoll zu sehen. | Aponte para um mosaico para ver o seu protocolo. |
| `checked.rung` | The 93 and 15 are the paper’s own count over its 108 protocols. The wall draws the same corpus at rung R2′, which keeps the structure of recursive protocols: there 47 of the 74 distinct lattices are not distributive, and 50 of the 104 protocols fall in one of them. | Die 93 und 15 sind die eigene Zählung des Papers über seine 108 Protokolle. Die Wand zeichnet denselben Korpus auf Stufe R2′, die die Struktur rekursiver Protokolle erhält: Dort sind 47 der 74 verschiedenen Verbände nicht distributiv, und 50 der 104 Protokolle fallen in einen davon. | Os 93 e 15 são a contagem do próprio artigo sobre os seus 108 protocolos. A parede desenha o mesmo corpus no nível R2′, que mantém a estrutura dos protocolos recursivos: aí 47 dos 74 reticulados distintos não são distributivos, e 50 dos 104 protocolos caem num deles. |
| `paper.kind` | Workshop paper | Workshop-Paper | Artigo de workshop |
| `paper.note` | Camera-ready · to appear in EPTCS | Druckfassung · erscheint in EPTCS | Versão final · a publicar na EPTCS |
| `paper.inEnglish` | In English (not shown) | Auf Englisch | Em inglês |
| `paper.abstractLabel` | Abstract | Zusammenfassung | Resumo |
| `results.heading` | What it proves | Was es beweist | O que prova |
| `checked.heading` | How it was checked | Wie es geprüft wurde | Como foi verificado |
| `checked.figures[].label` (108, 93, 15, Lean 4) | benchmark protocols, every one a lattice · distributive · not distributive · mechanised proof | Benchmark-Protokolle, jedes ein Verband · distributiv · nicht distributiv · mechanisierter Beweis | protocolos de referência, todos reticulados · distributivos · não distributivos · prova mecanizada |
| `tool.heading` | The tool | Das Werkzeug | A ferramenta |
| `tool.kicker` | Verification tool | Verifikationswerkzeug | Ferramenta de verificação |
| `tool.text` | the Software page's reticulateP text, word for word (D6) | the same, de | the same, pt |
| `tool.link.label` | reticulateP on the Software page | reticulateP auf der Software-Seite | O reticulateP na página de software |
| `more.heading` | More research | Mehr Forschung | Mais investigação |
| `more.earlier` | Earlier papers (2007–2010) | Frühere Paper (2007–2010) | Artigos anteriores (2007–2010) |
| `more.newTab` | opens in a new tab | öffnet in einem neuen Tab | abre num novo separador |

From `shared/paper`: `paperTitle`, `year`, `pdfUrl`, `read`, `theorem`, `definition`, `lemma`,
`proposition`, `evidence`, `statements`.

### Counts and their rung
Every number on the page belongs to one of two counts, and the page says which:

| Count | Numbers | Where on the page | Source |
|-------|---------|-------------------|--------|
| The paper's own (its construction) | 108 protocols; 93 distributive, 15 not | the abstract, the four figures, the evidence sentence | the abstract (`content.service.ts` line 95), `shared/paper.evidence` |
| The wall's, rung R2′ | 74 distinct lattices (classes), 47 of them not distributive; 104 of the 108 protocols drawn (four excluded), 50 of them in a non-distributive class | the wall's label and caption, the rung note | `lattices.json`; `scripts/lattice-wall/README.md` |

Class counts and protocol counts are never mixed in one phrase without saying which (README.md).
The numbers in `wall.*` and `checked.rung` are stored text; a test computes them from
`lattices.json` and holds the text to them in every language (D9).

### Same in every language
| Field | Value | From |
|-------|-------|------|
| `paper.author` | Alexandre Zua Caldeira | `ContentService.publications[0]` |
| `paper.venue` | ICE 2026 · International Workshop on Interaction and Concurrency Experience | Writing's `ice2026` row |
| `paper.abstract` | "We prove that the state space of every well-formed session type, quotiented by strongly connected components, forms a bounded lattice; n-ary parallel composition yields product lattices. Two consequences follow: duality preserves the lattice up to isomorphism, and Gay–Hole width subtyping corresponds to lattice embedding for non-recursive types. We validate this on 108 benchmark protocols across networking, databases, distributed systems, AI, and fault tolerance: all form lattices, 93 distributive, 15 non-distributive. Mechanised in Lean 4 with two independently developed tool implementations." | `content.service.ts` line 95, word for word |
| `checked.figures[].value` | `108`, `93`, `15`, `Lean 4` | the abstract |
| `tool.title`, `tool.stack` | reticulateP, Python | `R__software.sql` |
| `more.researchGate` | ResearchGate, `https://www.researchgate.net/profile/Alexandre-Caldeira` | today's `research.html` line 39 |
| the wall's tiles and `data-name` | `lattices.json`, sorted as render.py sorts | `scripts/lattice-wall/` |

### The four statements (`shared/paper.statements`, in this order)
| kind | number | name | text |
|------|--------|------|------|
| theorem | 15 | Reticulate Theorem | For every well-formed session type S, ℒ(S)/≡ is a bounded lattice. |
| definition | 6 | SCC quotient | The SCC quotient ℒ(S)/≡ identifies mutually reachable states, collapsing each recursion cycle to one class. It is ordered by [s₁] ≤ [s₂] iff s₂ ↠ s₁: a state is smaller when less of the protocol remains, so execution descends from q⊤ to q⊥. |
| lemma | 8 | End | ℒ(end)/≡ is a bounded lattice. |
| proposition | 18 | Duality isomorphism | For every well-formed session type S, there is a bounded-lattice isomorphism ℒ(S)/≡ ≅ ℒ(dual(S))/≡. |

Plain text, as the band shows Theorem 15 (D4).

## What goes
- The old page: its Material cards, "Publications", the ResearchGate `mat-stroked-button`, the three
  older abstracts; `research.spec.ts` is replaced.
- The i18n keys `research.subtitle`, `profilesHeading`, `publicationsHeading`, `paperLink` (D7).
- `ContentService.publications` stays while the home page's `paper-statements` reads it.
- The hero's `LatticeWall` component and its generated file are not touched (D8).

## States
- **Long data:** the abstract is the longest block (15 lines at 390). The German caption is the
  longest caption (five lines at 390).
- **German:** the longest page.
- **Stale wall data:** `lattices.json` is checked in and the build never consults the research repo
  (README.md). A regenerated file changes the wall and, through D9's test, fails the build until the
  stored counts are updated in every language.
- **No empty, loading or error state:** prerendered from the snapshot; a missing language stops the
  build.

## Accessibility
- One `<h1>`; each section an `<h2>`; the abstract label and the tool's name `<h3>`.
- The wall is one image (`role="img"`, the label with its counts and rung); tiles are not focusable;
  the hint is `aria-hidden`. Ochre marks non-distributive tiles, and the caption says so in words.
- The abstract and statements are `<blockquote>` with `translate="no"`, `lang="en"` on de and pt.
- Every link and the button at least 44 px tall.
- Motion only without `prefers-reduced-motion`; the page is complete without JavaScript.
- Measured in the mock-up (option A, en, de, pt at 390 and 1440, light and dark): no horizontal
  scroll, no control under 44 px, lowest text contrast 4.59:1 in light (the ochre kicker on the
  raised glaze) and 4.77:1 in dark (the stack line), lowest lattice stroke 3.2:1 in light and
  3.38:1 in dark.

## Tokens used
`--zc-bg-warm`, `--zc-bg-white`, `--zc-bg-light`, `--zc-border-light`, `--zc-text-heading`,
`--zc-text-body`, `--zc-text-muted`, `--zc-azul`, `--zc-azul-deep`, `--zc-on-accent`, `--zc-ochre`,
`--zc-ochre-text`, `--zc-edge`, `--zc-band-bg`, `--zc-band-fg`, `--grout`, the `--zc-space-*`
scale, `--zc-font-heading`, `--zc-font-body`, `--zc-font-mono`. No new token.

## References
- The project's own: the hero's lattice wall (`scripts/lattice-wall/`, `LatticeWall`), the azulejo
  and lattice direction (`docs/design.md`), and the theorem bands on Home and Software.
- `~/design-library` holds no entry for a data-led page head or a drawn-in diagram yet (its index has
  upload, navigation, calm dashboards, work index, detail page, short form); a library run on that
  topic would give this page outside references.

## Cases
`docs/examples/research.md`, IDs `RS-PAGE-nn`, `RS-HEAD-nn`, `RS-WALL-nn`, `RS-PAPER-nn`,
`RS-RES-nn`, `RS-CHECK-nn`, `RS-TOOL-nn`, `RS-MORE-nn`, `RS-COLOR-nn`, `RS-MOTION-nn`, `RS-SHOT-nn`,
with the slices.
