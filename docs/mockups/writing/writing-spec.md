# Build spec: Writing page

Chosen on 2026-11-08: **option 1, one quiet list** (D8 in `docs/examples/writing.md`). Visual
reference: `writing.html` beside this file (`#opt=1`), or `index.html` to compare; screenshots in
`screenshots/opt1-*.png`. Option 2 stays in the mock-up for comparison and is not built. Mock-ups
are not production code: do not copy their markup. The behaviour is in `docs/examples/writing.md`,
built test-first.

## Purpose
The menu's Writing link (SHELL-11) and, later, the home page's writing section lead here. The page
is the one complete list of what Alexandre Zua Caldeira has published, newest first, each text
linking to where it lives (D1, D3, D6). Readers, from `docs/design.md`:
- **Researchers and reviewers** (laptop): year, title, co-authors, venue, and the text one click away.
- **Hiring managers** (phone, a minute): that he publishes, and where.
- **Teams building AI agents:** write-ups, once they exist; a write-up takes the same row (D1).

## Sections, in order
1. **Head:** eyebrow, `<h1>`, one intro sentence, on the hero's lozenge tile. The Software page's
   head, unchanged in style.
2. **The list:** one section, four texts, newest first (D3). Its `<h2>` is visually hidden (the page
   name again), so the titles are `<h3>` under it.
3. **Footer:** the shared footer (SHELL-07), unchanged.

The header is the shared one; its Writing link is current (`aria-current="page"`, the ochre
underline, D34 in `software.md`). There is no theorem band: that ends the Software page.

## Layout per width
One column of 1200 px, gutter 24 px (16 px under `Handset`), as on the other pages.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Head | Eyebrow, `<h1>`, intro, stacked | The same | The same, intro up to 40 rem |
| One text | One column: year and kind on one line; title; authors; venue; note; "In English" line (de, pt); the link | One column | Three columns: `9rem`, `1fr`, `minmax(0, 15rem)`; year above kind on the left; title, authors, venue, note in the middle; language line and link on the right |

The switch to one column is at 900 px. Measured in the mock-up: page height 2,144 px at 390 (en),
2,263 px (de); 1,469 px at 1280 (en), 1,500 px (de).

## Components
- **Header, footer, language links, theme button, phone menu:** the existing shell (`shell.md`).
- **Page head:** the Software page's head (its component, or the same styles shared, not copied):
  tile pattern, eyebrow (Plex Mono 0.875 rem, `--zc-ochre-text`), `<h1>` (Fraunces 600,
  `clamp(2.5rem, 5vw, 4rem)`), intro (`clamp(1.0625rem, 1.5vw, 1.25rem)`, max 40 rem).
- **New, `TextRow`:** one text, a `<li>` in a `<ul>`, rows separated by a `--zc-border-light` rule
  (top on each, bottom on the last), `padding-block: var(--zc-space-6)`.
  - Year: Plex Mono 500, 1.25 rem, `--zc-text-heading`.
  - Kind: Plex Mono 0.8125 rem, `--zc-ochre-text` (translated).
  - Title: `<h3>`, Fraunces 600, 1.375 rem, line height 1.18, `text-wrap: balance`,
    `translate="no"`, and `lang="en"` on a page that is not English.
  - Authors: Archivo 0.9375 rem, in the order published, comma-separated, `translate="no"`; the
    author's own name (as published: "Alexandre Zua Caldeira", "Alexandre Z. Caldeira",
    "Alexandre Caldeira") in `<b>` 600, `--zc-text-heading`.
  - Venue: Plex Mono 0.8125 rem, `--zc-text-muted`, `overflow-wrap: anywhere`, `translate="no"`:
    the short name and year, " · ", the full name.
  - Note (the ICE paper only): Plex Mono 0.8125 rem after a 0.55 rem ochre lozenge (45°,
    decorative), as the Software page's status line.
  - Language line, on de and pt pages only: Plex Mono 0.8125 rem, `--zc-text-muted`
    ("Auf Englisch", "Em inglês"; D10). Not shown on English pages.
  - Link: Archivo 500, underlined, at least 44 px tall, `hreflang="en"`.
    - To a PDF on the site: the label `read`, same tab, `type="application/pdf"`.
    - Outside the site: its label (the place's name), new tab with `rel="noopener noreferrer"`
      (D27 in `software.md`), a `↗` in Plex Mono with `aria-hidden="true"`, and a visually hidden
      " (opens in a new tab)" in the page's language, so the arrow is never the only cue.

## Content
Text comes from the content API through the build's snapshot, page `writing`, one JSON object per
section, as the Software page (D11 in `software.md`), unless the developer decides otherwise (D12
in `writing.md`). Titles, author names, venue names, years and link targets are the same in every
language; only the labels are translated (`docs/design.md`: venue names and paper titles are never
translated).

### Copy (en / de / pt)
| Key | en | de | pt |
|-----|----|----|----|
| `title` | Alexandre Zua Caldeira — Writing | Alexandre Zua Caldeira — Texte | Alexandre Zua Caldeira — Textos |
| `head.eyebrow` | Published work | Veröffentlichungen | Publicações |
| `head.heading` | Writing | Texte | Textos |
| `head.intro` | Papers on session types, and on tools that check code against its specification, newest first. Each one links to where the text lives. | Paper über Session-Typen und über Werkzeuge, die Code gegen seine Spezifikation prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, wo der Text liegt. | Artigos sobre tipos de sessão e sobre ferramentas que verificam o código face à sua especificação, os mais recentes primeiro. Cada um leva ao sítio onde o texto está. |
| `texts.kinds.workshop` | Workshop paper | Workshop-Paper | Artigo de workshop |
| `texts.kinds.conference` | Conference paper | Konferenz-Paper | Artigo de conferência |
| `texts.kinds.report` | Technical report | Technischer Bericht | Relatório técnico |
| `texts.inEnglish` | (not shown) | Auf Englisch | Em inglês |
| `texts.read` | Read (PDF) | Lesen (PDF) | Ler (PDF) |
| `texts.newTab` | opens in a new tab | öffnet in einem neuen Tab | abre num novo separador |
| `texts.notes.ice` | Camera-ready · to appear in EPTCS | Druckfassung · erscheint in EPTCS | Versão final · a publicar na EPTCS |
| `nav.writing` | Writing | Texte | Textos |

The Portuguese copy is a draft nobody has read (D9 in `writing.md`); it is built as drafted and
reviewed on the preview, as D16 in `software.md`. The menu's words follow the menu's own style
(today's built menu writes "Software", "Forschung").

### The four texts (from `ContentService.publications`, word for word)
| id | year | kind | title | authors (as published) | venue | link |
|----|------|------|-------|------------------------|-------|------|
| `ice2026` | 2026 | workshop | Session Type State Spaces Form Lattices | **Alexandre Zua Caldeira** | ICE 2026 · International Workshop on Interaction and Concurrency Experience | `/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf`, label `texts.read`, note `texts.notes.ice` |
| `popl2010` | 2010 | conference | Modular Session Types for Distributed Object-Oriented Programming | Simon J. Gay, Vasco T. Vasconcelos, António Ravara, Nils Gesbert, **Alexandre Z. Caldeira** | POPL 2010 · ACM SIGPLAN Symposium on Principles of Programming Languages | `https://doi.org/10.1145/1706299.1706335`, label "ACM Digital Library (DOI)" |
| `fool2009` | 2009 | workshop | Dynamic Interfaces | Vasco T. Vasconcelos, Simon J. Gay, António Ravara, Nils Gesbert, **Alexandre Z. Caldeira** | FOOL 2009 · International Workshop on Foundations of Object-Oriented Languages | `https://eprints.gla.ac.uk/47911/`, label "eprints.gla.ac.uk" |
| `congu2007` | 2007 | report | ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications | João Abreu, **Alexandre Caldeira**, Antónia Lopes, Isabel Nunes, Luís S. Reis, Vasco T. Vasconcelos | DI/FCUL TR-07-7 · Department of Informatics, University of Lisbon | `https://repositorio.ulisboa.pt/handle/10451/14164`, label "repositorio.ulisboa.pt" |

The POPL link was a DOI only in `ContentService` (`doi`); the page links it through
`https://doi.org/`. The ICE short venue "ICE 2026" and the others' short names are taken from the
venue strings there (`ICE — International Workshop …` becomes `ICE 2026 · International Workshop …`).

## States
- **Long data:** the longest title (ConGu, 76 characters) wraps to three lines at 390 px and two at
  1280; the longest author line (six names) wraps to two lines at 390. Seen in the screenshots.
- **German:** the longest page (2,263 px at 390); "Technischer Bericht" wraps under the year at
  1280 in the left column, which is fine.
- **No empty, loading or error state:** the page is prerendered from the snapshot; a missing
  language stops the build (D4 in `home.md`).
- **A future write-up** takes the same row: kind "Write-up" (a new kind label then), a link on the
  site, no `↗`. Not built now (D6); the mock-up's "Write-up" switch shows it.

## Accessibility
- One `<h1>`; the list's `<h2>` visually hidden; each title an `<h3>`.
- Titles, names and venues `translate="no"`; on de and pt pages the titles carry `lang="en"`.
- Outside links say in words that they open a new tab; the arrow is decorative.
- Every link at least 44 px tall. Measured in the mock-up: none smaller, no horizontal scroll at
  390, lowest text contrast 4.91:1 (the ochre kind label) in light, 5.36:1 in dark.
- The own name is bold, and its meaning (this is the author) needs no colour.

## Tokens used
`--zc-bg-warm`, `--zc-border-light`, `--zc-text-heading`, `--zc-text-body`, `--zc-text-muted`,
`--zc-ochre`, `--zc-ochre-text`, `--zc-azul` (links), `--grout` (tile), the `--zc-space-*` scale,
`--zc-font-heading`, `--zc-font-body`, `--zc-font-mono`. No new token.

## Cases
`docs/examples/writing.md`, IDs `WR-PAGE-nn`, `WR-HEAD-nn`, `WR-LIST-nn`, with the slices.
