# Examples: Software page

Status: **agreed with the developer on 2026-11-08** (D1–D4 and D6 first; D3's wording, D5, D7, D8
and D9 answered the same day, then D10 to D16 for the build). The Portuguese copy is a draft nobody
has read yet: it is built as drafted and reviewed by the developer on the preview (D16).

The Software page in three languages, at `/en/software`, `/de/software` and `/pt/software`.
Design: `docs/mockups/software/software-spec.md` (option 1, lead plus list), with the mock-up
and screenshots beside it. The page exists so that the home page's "See selected work" and the
lattice's `software` atom (HOME-HERO-01 to 03, 09) reach a page instead of the 404 (D15 in
`home.md`), and it is the first of the two pages SHELL-11 waits for.

Sections, in build order:
1. **Page frame** (`SW-PAGE-nn`): the three pages, their `lang`, title, alternates, sitemap and
   the links that reach them.
2. **Head** (`SW-HEAD-nn`): eyebrow, `<h1>`, intro.
3. **Lead case study** (`SW-LEAD-nn`): the TDD monitor.
4. **More work** (`SW-WORK-nn`): reticulateP, Kita Dienstplan, Casa Azul website.
5. **How I work** (`SW-HOW-nn`): three steps and the checked global type.
6. **Proof** (`SW-PROOF-nn`): Theorem 15 and the evidence line.

Not in this file: the header, language links and footer (`shell.md`), the colours (`theme.md`).
All wording below is in the spec's copy table, en, de and pt; a case names a key and gives one
language as its example.

"In plain words" says what each case means for a visitor, in English.

## 1. Page frame

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PAGE-01 | The Software page exists in all three languages. | the software content in en, de and pt | the site is built | `/en/software/index.html`, `/de/software/index.html`, `/pt/software/index.html` exist, with `<html lang="en">`, `"de"`, `"pt"` | |
| SW-PAGE-02 | Search engines learn that the three pages are one page in three languages. | the built `/de/software` | it is read | `<link rel="alternate">` for `hreflang` en, de, pt to `https://zuacaldeira.com/{en,de,pt}/software`, and `x-default` to `/en/software` | |
| SW-PAGE-03 | The browser tab names the page. | the built pages | they are read | `<title>` is "Alexandre Zua Caldeira — Software" in en, de and pt (D9) | |
| SW-PAGE-04 | The sitemap lists the new pages, and only built ones. | the built site | `sitemap.xml` is read | it lists `https://zuacaldeira.com/{en,de,pt}/software` beside the 15 pages of HOME-PAGE-07, 18 in all, and each is a built page (HOME-PAGE-08) | |
| SW-PAGE-05 | "See selected work" on the home page now opens the Software page, not the 404 page. | the built `/de/home` | its links are read | the hero's "Ausgewählte Arbeiten" and the lattice's `software` go to `/de/software`, which is built (SHELL-04 now accepts it; its P-04 example moves to `/de/writing`) | moved to the v2 hero (D12): the home page has no such link yet; HOME-HERO-01, 03 and 09 hold it |
| SW-PAGE-06 | In the web server, the new page opens straight away. | the built site in the web image's nginx | `/en/software`, `/de/software`, `/pt/software` are requested | each answers `200`, not the 404 page, with no redirect (HOME-PAGE-09); `/de/software/` answers `301` to `/de/software` (HOME-PAGE-10) | |
| SW-PAGE-07 | The header shows "Software" as the page you are on. | the built `/pt/software` | the main navigation is read | its "software" link goes to `/pt/software` and carries `aria-current="page"`; no other link does | |
| SW-PAGE-08 | The language links lead to the same page in the other language. | the built `/de/software` | its language links are read | `EN` → `/en/software`, `PT` → `/pt/software`, `DE` current (SHELL-01, 02 on the new page) | |
| SW-PAGE-09 | A missing German text stops the build instead of showing English. | no software content stored for de | the site is built | the build fails, naming page `software`, the section and `de`; nothing is deployed (as HOME-HERO-06, D4 in `home.md`) | |
| SW-PAGE-10 | The page is in the main navigation, and the menu still waits only for Writing. | the built `/de/home` | the main navigation is read | it holds Software → `/de/software`; SHELL-11 is covered except Texte → `/de/writing` | |
| SW-PAGE-P-01 | A software page in only one or two languages is refused. | the build | a language's software page is missing | SW-PAGE-01 goes red, naming the language | |
| SW-PAGE-P-02 | A link to the Software page that drops the language is refused. | any built page | a link to `/software` (no prefix) is read | SHELL-04 goes red (an old path, P-01) | |

## 2. Head

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-HEAD-01 | The page opens with its name and one sentence about it. | the built `/en/software` | the head is read | eyebrow "Selected work", `<h1>` "Software", the intro (`head.intro`, en); the page has exactly one `<h1>` | |
| SW-HEAD-02 | The German page reads in German, the eyebrow matching the home page's button. | the built `/de/software` | the head is read | "Ausgewählte Arbeiten" (the same words as HOME-HERO-01's link), "Software", `head.intro` de | |
| SW-HEAD-03 | The Portuguese page reads in Portuguese. | the built `/pt/software` | the head is read | "Trabalhos selecionados", "Software", `head.intro` pt | |
| SW-HEAD-04 | When the site asks for the German head, it gets its three texts exactly as stored. | `software/head` stored for de | `GET /api/content/software/head?lang=de` | 200 with `{"eyebrow": "Ausgewählte Arbeiten", "heading": "Software", "intro": "Software, die ich gebaut habe, …"}`, the stored JSON as it is (D10, D11) | |
| SW-HEAD-05 | A fresh database, filled with the starting texts, gives the head in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/software/head?lang=en`, `de`, `pt` | 200 with the spec's copy for `eyebrow`, `heading`, `intro`, each non-empty | |
| SW-HEAD-P-01 | English text on the German page's head is refused. | the built `/de/software` | the English intro is put in | SW-HEAD-02 goes red | |
| SW-HEAD-P-02 | A second main heading is refused. | the built `/de/software` | a second `<h1>` is put in | SW-HEAD-02 goes red | |
| SW-HEAD-P-03 | A language the site does not have, or a section that does not exist, gets nothing. | `software/head` stored, with a stray `fr` row | `?lang=fr`, or `software/nope?lang=en` | 404 with an empty body, no fallback (as HOME-HERO-07, 12) | |

## 3. Lead case study

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-LEAD-01 | The first piece of work is the TDD monitor, told as a case study. | the built `/en/software` | the first section after the head is read | kicker "Case study · AI agents", `<h2>` "A monitor that holds a coding agent to its TDD protocol", status "In use on this site since November 2026" | |
| SW-LEAD-02 | The case study answers five questions, in this order. | the same | its blocks are read | five headings in order: The question, What I built, The protocol behind it, The live view, The result; each followed by its text (`lead.*`, en); then Stack | |
| SW-LEAD-03 | The German and Portuguese case studies are fully translated. | the built `/de/software` and `/pt/software` | the lead is read | every text is the de or pt copy; no English sentence (P-02) | |
| SW-LEAD-04 | The protocol is shown as the real line from the checked workflow type. | any language | the protocol block is read | a `<pre translate="no">` whose text, with whitespace collapsed, is exactly `Run = &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}`, the same in en, de and pt, and equal to the recorded checked line (D5); its caption is `lead.runCaption` | |
| SW-LEAD-05 | A small drawing shows the one action and its three results. | any language | the figure is read | an SVG with `role="img"` and the translated `lead.figure` as its name and caption; its labels `Run`, `&{runTest}`, `+RED`, `+WRONG_RED`, `+GREEN`, `Code`, `Fix`, `Green` in every language | |
| SW-LEAD-06 | A screenshot shows the live view, light or dark to match the page. | `/en/software` in the browser, light and dark theme | the screenshot is read | exactly one image shows: `reticulab-live-light.png` on a light glaze, `-dark.png` on a dark one; its alt text is `lead.shotAlt` in the page's language; it links to the full-size file; its caption is `lead.shotCaption` | |
| SW-LEAD-07 | The result says only what is true: in use on this site. | any language | the result is read | `lead.result`; the page makes no claim of better or worse results, and gives no figures for the experiment | |
| SW-LEAD-08 | The case study has no link to the lab, which is private. | the built pages | the lead's links are read | it has none: no repository, no write-up (D2) | |
| SW-LEAD-P-01 | A Run line that differs from the checked one is refused. | the built page | its Run line is changed (a label renamed, `WRONG_RED` dropped) or the recorded line changes while the page does not | SW-LEAD-04 goes red | |
| SW-LEAD-P-02 | English text on a German or Portuguese case study is refused. | the built `/de/software` | an English block is put in | SW-LEAD-03 goes red | |
| SW-LEAD-P-03 | Notation translated on a German page is refused. | the built `/de/software` | the figure reads `+ROT` or the line `Lauf = …` | SW-LEAD-04 or 05 goes red | |

## 4. More work

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-WORK-01 | Three more pieces follow, in a fixed order. | the built `/en/software` | the section is read | `<h2>` "More work", then three rows, in order: reticulateP, Kita Dienstplan, Casa Azul website, each with its kicker, `<h3>` title, text and stack (spec) | |
| SW-WORK-02 | reticulateP links to the paper, not to its private repository. | any language | the reticulateP row's links are read | exactly one: the paper's PDF, labelled `work.ret.paper` | |
| SW-WORK-03 | Kita Dienstplan links to its repository. | any language | its links are read | exactly one: https://github.com/zuacaldeira/kita-dienstplan, labelled `work.repo` (D8) | |
| SW-WORK-04 | The Casa Azul website links to the live site and its repository. | any language | its links are read | https://casa-azul-berlin.de, labelled `casa-azul-berlin.de`, and https://github.com/zuacaldeira/ca-website, labelled `work.repo` (D8) | |
| SW-WORK-05 | The rows are translated; the names and stacks are not. | `/de/software`, `/pt/software` | the rows are read | kicker and text in the page's language; the names reticulateP and Kita Dienstplan and the stacks the same as in en; the Casa Azul title `work.casa.title` translated | |
| SW-WORK-P-01 | A fourth piece, or a different order, is refused. | the built page | the Embassy line is put back, or Dienstplan moved first | SW-WORK-01 goes red | |

## 5. How I work

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-HOW-01 | Three steps say how the work is done. | the built `/en/software` | the section is read | `<h2>` "How I work", an ordered list of three: Protocol first, Test-first one step at a time, Every forbidden path shown red, each with its sentence (`how.*`) | |
| SW-HOW-02 | The strip shows this site's own links protocol, exactly as checked. | any language | its session type is read | a `<pre translate="no">` whose text is exactly `Page -> Visitor : {links: Visitor -> Nginx : {get: Nginx -> Visitor : {ok200: end}}}`, the same in every language, equal to the recorded checked line (D5); the caption `how.caption` | |
| SW-HOW-03 | The strip is translated, except the type. | `/de/software`, `/pt/software` | the section is read | headings, steps and caption in the page's language | |
| SW-HOW-P-01 | The old arrow notation in the strip is refused. | the built page | the type reads `Page → Visitor : links(hrefs) . …` | SW-HOW-02 goes red | |

## 6. Proof

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PROOF-01 | The page ends on the theorem that makes the protocols hold. | the built `/de/software` | the band is read | "Aus dem Paper — Session Type State Spaces Form Lattices · ICE 2026", "Warum die Protokolle halten", the statement "For every well-formed session type S, ℒ(S)/≡ is a bounded lattice." (untranslated), the home band's German evidence line | |
| SW-PROOF-02 | Two buttons lead on: the paper, and the research page in the same language. | any language | its buttons are read | "Read the paper (PDF)" / "Paper lesen (PDF)" / "Ler o artigo (PDF)" → the paper's PDF; "All research" / "Zur Forschung" / "Toda a investigação" → `/xx/research` | |

## In the browser (after the build, `npm run acceptance:browser`)

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PAGE-11 | The page fits a phone: nothing runs off the side. | a phone at 390 px, `/en/software`, `/de/software`, `/pt/software` | the page is measured | no horizontal scroll; no `<pre>` scrolls sideways | |
| SW-PAGE-12 | Every link on the page is easy to tap. | the same | the page's links and buttons are measured | each is at least 44 px tall | |
| SW-PAGE-13 | Keyboard users get to the content first. | `/de/software`, 390 and 1280 px | Tab, then Enter | the skip link goes to `<main>` on the same page (SHELL-10 on the new page) | |

## Diagram: SW-PAGE (the page frame, at build time)

```mermaid
sequenceDiagram
    autonumber
    actor Test as Acceptance test
    participant API as Content API (build backend)
    participant Snap as content.generated.json
    participant Build as Angular build (prerender)
    participant Page as dist/…/l/software/index.html
    Test->>API: npm run content: page software, each section, l ∈ {en, de, pt}
    API-->>Snap: one object per section, or 404 → the build stops (SW-PAGE-09)
    Build->>Page: prerender /l/software with lang = l
    Test->>Page: lang, title, alternates (01–03)
    Test->>Page: sitemap lists it, it is built (04)
    Test->>Page: home's links reach it (05), nav current (07), language links (08)
```

Session type (the visitor's path from the home page), in the convention of `shell.md`:

```
G = Home → Visitor : links(work = /l/software, atom = /l/software) .
    Visitor → Nginx : get(/l/software) .
    Nginx → Visitor : ok200(softwarePage, lang l) . end
```

Before this page, `ok200` was `notFound404`: the change is in what the visitor receives, so it is a
change of behaviour, not a refactor.

## Slices (D10, agreed 2026-11-08)

Each slice ships on `next` with the route live but **no navigation link and no sitemap entry**
until slice 7, so a merge of `next` mid-way leaves the page out of reach (`docs/tdd.md`).

1. **Frame + head:** route, `lang`, title, alternates, the content pipeline, the head. SW-PAGE-01,
   02, 03, 08, 09, P-01, P-02; SW-HEAD-01 to 05, P-01 to P-03.
2. **Lead, text and Run line:** `SessionType`, `docs/notation/run.st`. SW-LEAD-01 to 04, 07, 08,
   P-01 to P-03.
3. **Lead, figure and screenshot:** `RunFigure`, `MonitorShot`. SW-LEAD-05, 06.
4. **More work:** SW-WORK-01 to 05, P-01.
5. **How I work:** `HowStrip`, `docs/notation/links.global`. SW-HOW-01 to 03, P-01.
6. **Proof:** SW-PROOF-01, 02 (D14).
7. **Open the page:** navigation (D13), current marker, sitemap (18 URLs), nginx, phone and
   keyboard checks. SW-PAGE-04, 06, 07, 10 to 13.

## Slice 1: frame + head

Test list:
- **Backend** (Testcontainers, one class per run): B1 SW-HEAD-04, the stored German head as it is;
  B2 SW-HEAD-05, the seed in en, de, pt; B3 SW-HEAD-P-03, `fr` and an unknown section answer 404.
- **Script:** S1 SW-PAGE-09, the snapshot asks for `software/head` in each language, and a 404 for
  `de` stops it naming page `software`, section `head`, language `de`.
- **Unit:** U1 the route `/de/software` loads the Software page in German; U2 SW-PAGE-03, the title
  (D9, D11); U3 SW-HEAD-02, the head from `CONTENT` on a German page.
- **Acceptance:** A SW-HEAD-02, the outer test; A2 SW-PAGE-01; A3 SW-PAGE-02; A4 SW-PAGE-03; A5
  SW-HEAD-01 and 03; A6 the three pages join `PAGES` in `shell.test.mjs` (SW-PAGE-08, SHELL-04 and
  SHELL-07b on the new pages).
- **Protocol rows:** SW-PAGE-P-01 (a built page deleted), SW-PAGE-P-02 (a link to `/software`),
  SW-HEAD-P-01 (the English intro on `/de/software`), SW-HEAD-P-02 (a second `<h1>`).

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1–B3
        participant DB as MySQL 8 (Flyway + seed)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant P as dist/…/l/software/index.html
    T->>API: B1–B3: GET software/head?lang=l
    API->>DB: select body where page=software, section=head, lang=l
    F->>API: GET software/head?lang=l, for l in en, de, pt
    API-->>F: 200 {eyebrow, heading, intro} or 404 → the build stops (S1)
    F->>NG: snapshot
    NG->>P: route /l/software (U1): lang, alternates, title (U2), head (U3)
    T->>P: A, A2–A6, P rows
```

Session type. Convention: a role that a branch never calls just ends there.

```
G = Build → API : get(software, head, l) .
    API → Build : { ok200(head_l) .
                    Build → Page : prerender(l, title, alternates, head_l) .
                    Page → Visitor : page(lang = l, h1, links) . end ,
                    missing404 . Build → CI : fail(software, head, l) . end }

Build ↾   = API!get . API?{ ok200 . Page!prerender . end , missing404 . CI!fail . end }
Visitor ↾ = Page?page(lang = l, h1, links) . end
API ↾     = Build?get . Build!{ ok200 . end , missing404 . end }
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1–2 test → API → DB | `get`, `ok200(head_l)` | B1, B2 |
| 1 with `fr` or an unknown section | `missing404` | B3 |
| 3–4 F → API | `get` × 3, `{ok200, missing404}` | S1 |
| 5–6 NG → P | `prerender(l, title, alternates, head_l)` | U1, U2, U3 |
| 7 T → P | `page(lang, h1, links)` | A, A2–A6 |
| forbidden: a page missing for some `l` | `prerender` for every `l` | SW-PAGE-P-01 |
| forbidden: `head_en` on an `l = de` page | `ok200(head_l)` | SW-HEAD-P-01 |
| forbidden: `h1` twice | `page` carries one `h1` | SW-HEAD-P-02 |
| forbidden: a link to `/software` | `links ⊆ /l/x` (SHELL-04) | SW-PAGE-P-02 |

The build is read-only: no repeat, stale-token or race rows.

## Decisions

Agreed with the developer on 2026-11-08:

- **D1. Option 1, lead plus list.** The pieces, in order: the TDD monitor (the lead), then
  reticulateP, Kita Dienstplan, Casa Azul website. This website is not a piece. The Embassy of
  Angola line, the lattice-wall generator and ConGu are out.
- **D2. No links to private work.** The lab and reticulateP are private repositories: no
  repository link for either. The experiment's write-up does not exist yet: no link and no
  placeholder.
- **D3. The intro sentence** is a draft by ui-design-peer from the hero's line, in en and de (pt
  in the spec); the developer reviews its wording before the build.
- **D4. The notation shown** is the checked text: the Run line is line 10 of the lab's
  `types/agent/workflow/ext-generic.st` (56 states, 89 transitions, a lattice), and the links
  protocol is the global type `Page -> Visitor : {links: Visitor -> Nginx : {get: Nginx -> Visitor
  : {ok200: end}}}`, both checked by the developer with reticulateP main `7d20ba416` on 2026-11-08.
  The strip shows the global type, not the `→ … .` notation of `shell.md`.
- **D6. No employers or years** on the page; the stack as plain words in Plex Mono.
- **The screenshot** of `reticulab serve` (session `68601dc0`, while it built HOME-PAGE-05) is the
  live view's picture, in light and dark, at `frontend/public/assets/software/`.

Answered by the developer on 2026-11-08:

- **D3, the intro sentence:** the draft stands: "Software I have built, and how I hold it to its
  protocol: written down first, checked, then built test-first.", with the de and pt versions in
  the spec.
- **D5. The checked lines** live in `docs/notation/run.st` and `docs/notation/links.global`, and the
  build's tests compare each page's line with its file, as they do with `zua.st`. Both were
  **checked in the lab** with the pinned reticulateP (main `7d20ba416`) on 2026-11-08: `Run =
  &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}` is line 10 of the lab's workflow type,
  which parses (56 states, 89 transitions, a lattice); `Page -> Visitor : {links: Visitor -> Nginx :
  {get: Nginx -> Visitor : {ok200: end}}}` parses as a global type. `run.st` holds the one line as
  shown on the page, and says that it is a line of the lab's checked workflow type, not a whole
  program.
- **D7. The text comes from the content API,** seeded like the home hero (`docs/tdd.md`).
- **D8. Both repositories are public** (checked 2026-11-08): `github.com/zuacaldeira/kita-dienstplan`
  and `github.com/zuacaldeira/ca-website`. The links stay. reticulateP's repository is private: no
  link.
- **D9. The title** is "Alexandre Zua Caldeira — Software" in all three languages: the full name,
  as the footer has it, not "Alexandre Caldeira".

Agreed with the developer on 2026-11-08, for the build:

- **D10. Seven slices,** as listed above; slice 1 is frame + head with its test list.
- **D11. The content table:** one generic table `content_section(page, section, lang, body JSON)`,
  keyed on all three, in one Flyway migration; the controller answers the stored JSON as it is.
  `software/head` is `{eyebrow, heading, intro}`; the title is built in the component as
  `Alexandre Zua Caldeira — ${heading}`, so the name stays in the template. `home_hero` stays as it
  is (backlog).
- **D12. SW-PAGE-05 moves to the v2 hero:** the home page has no link to `/software` yet.
- **D13. The navigation** (slice 7): Software before Research; the rest waits for Writing
  (SHELL-11).
- **D14. The proof band** (slice 6): a shared theorem-band component and one shared content section
  for the paper's labels; the home band reuses both later.
- **D15. The home page's title stays** "Alexandre Caldeira — …"; "Zua" in it goes to the backlog.
- **D16. The Portuguese copy** in the spec is a draft nobody has read: built as drafted, and listed
  for the developer's review on the preview.

## Backlog

- **`home_hero` into `content_section`** (D11): a refactor, the API's answers unchanged
  (HOME-HERO-05 to 16 stay green).
- **"Alexandre Zua Caldeira" in the home page's title** (D15, HOME-PAGE-03).
