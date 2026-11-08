# Examples: Software page

Status: **agreed with the developer on 2026-11-08** (D1–D4 and D6 first; D3's wording, D5, D7, D8
and D9 answered the same day, then D10 to D16 for the build; D17 to D19 taken in slice 2's plan). The Portuguese copy is a draft nobody
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
| SW-PAGE-01 | The Software page exists in all three languages. | the software content in en, de and pt | the site is built | `/en/software/index.html`, `/de/software/index.html`, `/pt/software/index.html` exist, with `<html lang="en">`, `"de"`, `"pt"` | yes (build and unit, 2026-11-08) |
| SW-PAGE-02 | Search engines learn that the three pages are one page in three languages. | the built `/de/software` | it is read | `<link rel="alternate">` for `hreflang` en, de, pt to `https://zuacaldeira.com/{en,de,pt}/software`, and `x-default` to `/en/software` | yes (build, 2026-11-08) |
| SW-PAGE-03 | The browser tab names the page. | the built pages | they are read | `<title>` is "Alexandre Zua Caldeira — Software" in en, de and pt (D9) | yes (build and unit, 2026-11-08) |
| SW-PAGE-04 | The sitemap lists the new pages, and only built ones. | the built site | `sitemap.xml` is read | it lists `https://zuacaldeira.com/{en,de,pt}/software` beside the 15 pages of HOME-PAGE-07, 18 in all, and each is a built page (HOME-PAGE-08) | yes (build, 2026-11-08) |
| SW-PAGE-05 | "See selected work" on the home page now opens the Software page, not the 404 page. | the built `/de/home` | its links are read | the hero's "Ausgewählte Arbeiten" and the lattice's `software` go to `/de/software`, which is built (SHELL-04 now accepts it; its P-04 example moves to `/de/writing`) | moved to the v2 hero (D12): the home page has no such link yet; HOME-HERO-01, 03 and 09 hold it |
| SW-PAGE-06 | In the web server, the new page opens straight away. | the built site in the web image's nginx | `/en/software`, `/de/software`, `/pt/software` are requested | each answers `200`, not the 404 page, with no redirect (HOME-PAGE-09); `/de/software/` answers `301` to `/de/software` (HOME-PAGE-10) | yes (web image's nginx, 2026-11-08; on `next` after the push, by hand) |
| SW-PAGE-07 | The header shows "Software" as the page you are on. | the built `/pt/software` | the main navigation is read | its "software" link goes to `/pt/software` and carries `aria-current="page"`; no other link does | yes (build and unit, desktop and phone menus, 2026-11-08, D34) |
| SW-PAGE-08 | The language links lead to the same page in the other language. | the built `/de/software` | its language links are read | `EN` → `/en/software`, `PT` → `/pt/software`, `DE` current (SHELL-01, 02 on the new page) | yes (build, the shell's tests on the three pages, 2026-11-08) |
| SW-PAGE-09 | A missing German text stops the build instead of showing English. | no software content stored for de | the site is built | the build fails, naming page `software`, the section and `de`; nothing is deployed (as HOME-HERO-06, D4 in `home.md`) | yes (the snapshot script, 2026-11-08) |
| SW-PAGE-10 | The page is in the main navigation, and the menu still waits only for Writing. | the built `/de/home` | the main navigation is read | it holds Software → `/de/software`; SHELL-11 is covered except Texte → `/de/writing` | yes (build and unit, 2026-11-08): Software before Forschung; SHELL-11's Texte and its order wait for Writing (D13) |
| SW-PAGE-15 | The theorem on the band is set in the light weight the design asks for. | the built pages | the font link in `<head>` is read | it asks for Fraunces at weight 400 as well as 500 and 600 (home-spec.md, "Fonts") | yes (build, 2026-11-08: the production build inlines the link, so the page's `@font-face` rules are read) |
| SW-PAGE-P-03 | Two links marked as the current page are refused. | the built `/pt/software` | a second menu link carries `aria-current="page"` | SW-PAGE-07 goes red | yes (break in the build) |
| SW-PAGE-P-04 | A sitemap that names a page not built is refused. | the built site | `/de/writing` is put into the sitemap | SW-PAGE-04 (HOME-PAGE-08) goes red | yes (break in the built sitemap) |
| SW-PAGE-P-01 | A software page in only one or two languages is refused. | the build | a language's software page is missing | SW-PAGE-01 goes red, naming the language | yes (break in the build: `pt` moved out) |
| SW-PAGE-P-02 | A link to the Software page that drops the language is refused. | any built page | a link to `/software` (no prefix) is read | SHELL-04 goes red (an old path, P-01) | yes (break in the build) |

## 2. Head

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-HEAD-01 | The page opens with its name and one sentence about it. | the built `/en/software` | the head is read | eyebrow "Selected work", `<h1>` "Software", the intro (`head.intro`, en); the page has exactly one `<h1>` | yes (build, 2026-11-08) |
| SW-HEAD-02 | The German page reads in German, the eyebrow matching the home page's button. | the built `/de/software` | the head is read | "Ausgewählte Arbeiten" (the same words as HOME-HERO-01's link), "Software", `head.intro` de | yes (build and unit, 2026-11-08) |
| SW-HEAD-03 | The Portuguese page reads in Portuguese. | the built `/pt/software` | the head is read | "Trabalhos selecionados", "Software", `head.intro` pt | yes (build, 2026-11-08) |
| SW-HEAD-04 | When the site asks for the German head, it gets its three texts exactly as stored. | `software/head` stored for de | `GET /api/content/software/head?lang=de` | 200 with `{"eyebrow": "Ausgewählte Arbeiten", "heading": "Software", "intro": "Software, die ich gebaut habe, …"}`, the stored JSON as it is (D10, D11) | yes (integration, 2026-11-08) |
| SW-HEAD-05 | A fresh database, filled with the starting texts, gives the head in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/software/head?lang=en`, `de`, `pt` | 200 with the spec's copy for `eyebrow`, `heading`, `intro`, each non-empty | yes (integration, 2026-11-08) |
| SW-HEAD-P-01 | English text on the German page's head is refused. | the built `/de/software` | the English intro is put in | SW-HEAD-02 goes red | yes (break in the build) |
| SW-HEAD-P-02 | A second main heading is refused. | the built `/de/software` | a second `<h1>` is put in | SW-HEAD-02 goes red | yes (break in the build) |
| SW-HEAD-P-03 | A language the site does not have, or a section that does not exist, gets nothing. | `software/head` stored, with a stray `fr` row | `?lang=fr`, or `software/nope?lang=en` | 404 with an empty body, no fallback (as HOME-HERO-07, 12) | yes (integration: red before for `fr`; break for the section) |

## 3. Lead case study

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-LEAD-01 | The first piece of work is the TDD monitor, told as a case study. | the built `/en/software` | the first section after the head is read | kicker "Case study · AI agents", `<h2>` "A monitor that holds a coding agent to its TDD protocol", status "In use on this site since November 2026" | yes (build and unit, 2026-11-08) |
| SW-LEAD-02 | The case study answers five questions, in this order. | the same | its blocks are read | five headings in order: The question, What I built, The protocol behind it, The live view, The result; each followed by its text (`lead.*`, en); then Stack | yes (build and unit, 2026-11-08) |
| SW-LEAD-03 | The German and Portuguese case studies are fully translated. | the built `/de/software` and `/pt/software` | the lead is read | every text is the de or pt copy; no English sentence (P-02) | yes (build, 2026-11-08) |
| SW-LEAD-04 | The protocol is shown as the real line from the checked workflow type. | any language | the protocol block is read | a `<pre translate="no">` whose text, with whitespace collapsed, is exactly `Run = &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}`, the same in en, de and pt, and equal to the recorded checked line (D5); its caption is `lead.runCaption` | yes (build and unit, 2026-11-08; `docs/notation/run.st`, D17) |
| SW-LEAD-05 | A small drawing shows the one action and its three results. | any language | the figure is read | an SVG with `role="img"` and the translated `lead.figure` as its name and caption; its labels `Run`, `&{runTest}`, `+RED`, `+WRONG_RED`, `+GREEN`, `Code`, `Fix`, `Green` in every language | yes (build and unit, 2026-11-08) |
| SW-LEAD-06 | A screenshot shows the live view, light or dark to match the page. | `/en/software` in the browser, light and dark theme | the screenshot is read | exactly one image shows: `reticulab-live-light.png` on a light glaze, `-dark.png` on a dark one; its alt text is `lead.shotAlt` in the page's language; it links to the full-size file; its caption is `lead.shotCaption` | yes (browser, light and dark, the other image never downloaded since D25; build and unit, 2026-11-08) |
| SW-LEAD-07 | The result says only what is true: in use on this site. | any language | the result is read | `lead.result`; the page makes no claim of better or worse results, and gives no figures for the experiment | yes (build, 2026-11-08: the lead's only numbers are 2026, 56, 89, 2026) |
| SW-LEAD-08 | The case study has no link to the lab, which is private. | the built pages | the lead's links are read | it has none: no repository, no write-up (D2) | yes (build and unit, 2026-11-08) |
| SW-LEAD-09 | A fresh database, filled with the starting texts, gives the whole case study in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/software/lead?lang=en`, `de`, `pt` | 200; en is the spec's copy (D19's shape), and de and pt have the same fields, each non-empty | yes (integration, 2026-11-08) |
| SW-LEAD-P-01 | A Run line that differs from the checked one is refused. | the built page | its Run line is changed (a label renamed, `WRONG_RED` dropped) or the recorded line changes while the page does not | SW-LEAD-04 goes red | yes (break in the build; break in `run.st`) |
| SW-LEAD-P-02 | English text on a German or Portuguese case study is refused. | the built `/de/software` | an English block is put in | SW-LEAD-03 goes red | yes (break in the build) |
| SW-LEAD-P-04 | A screenshot that does not match the theme, or both at once, is refused. | `/en/software` in the browser, light and dark | the dark image shows on a light page, both show, or the hidden one is downloaded too | SW-LEAD-06 goes red | yes (the image shown: break in `monitor-shot.ts`, rebuilt; the download: red before D25, `downloaded: light,dark`) |
| SW-LEAD-P-03 | Notation translated on a German page is refused. | the built `/de/software` | the figure reads `+ROT` or the line `Lauf = …` | SW-LEAD-04 or 05 goes red | yes (breaks in the build: the line's `Lauf = …`, `ROT`; the figure's `+ROT`) |

## 4. More work

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-WORK-01 | Three more pieces follow, in a fixed order. | the built `/en/software` | the section is read | `<h2>` "More work", then three rows, in order: reticulateP, Kita Dienstplan, Casa Azul website, each with its kicker, `<h3>` title, text and stack (spec) | yes (build and unit, 2026-11-08) |
| SW-WORK-02 | reticulateP links to the paper, not to its private repository. | any language | the reticulateP row's links are read | exactly one: the paper's PDF, labelled `work.ret.paper` | yes (build and unit, 2026-11-08) |
| SW-WORK-03 | Kita Dienstplan links to its repository. | any language | its links are read | exactly one: https://github.com/zuacaldeira/kita-dienstplan, labelled `work.repo` (D8) | yes (build and unit, 2026-11-08) |
| SW-WORK-04 | The Casa Azul website links to the live site and its repository. | any language | its links are read | https://casa-azul-berlin.de, labelled `casa-azul-berlin.de`, and https://github.com/zuacaldeira/ca-website, labelled `work.repo` (D8) | yes (build and unit, 2026-11-08; outside links in a new tab, D27) |
| SW-WORK-05 | The rows are translated; the names and stacks are not. | `/de/software`, `/pt/software` | the rows are read | kicker and text in the page's language; the names reticulateP and Kita Dienstplan and the stacks the same as in en; the Casa Azul title `work.casa.title` translated | yes (build, 2026-11-08) |
| SW-WORK-06 | A fresh database, filled with the starting texts, gives the three pieces in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/software/work?lang=en`, `de`, `pt` | 200; en is the spec's copy (D26's shape); de and pt have the same rows, ids, names, stacks and links' targets, each text non-empty | yes (integration, 2026-11-08) |
| SW-WORK-P-02 | A link to a private repository is refused. | the built page | a repository link is put on the reticulateP row | SW-WORK-02 goes red | yes (break in the build) |
| SW-WORK-P-01 | A fourth piece, or a different order, is refused. | the built page | the Embassy line is put back, or Dienstplan moved first | SW-WORK-01 goes red | yes (break in the build, both) |

## 5. How I work

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-HOW-01 | Three steps say how the work is done. | the built `/en/software` | the section is read | `<h2>` "How I work", an ordered list of three: Protocol first, Test-first one step at a time, Every forbidden path shown red, each with its sentence (`how.*`) | yes (build and unit, 2026-11-08) |
| SW-HOW-02 | The strip shows this site's own links protocol, exactly as checked. | any language | its session type is read | a `<pre translate="no">` whose text is exactly `Page -> Visitor : {links: Visitor -> Nginx : {get: Nginx -> Visitor : {ok200: end}}}`, the same in every language, equal to the recorded checked line (D5); the caption `how.caption` | yes (build and unit, 2026-11-08; `docs/notation/links.global`, D29) |
| SW-HOW-03 | The strip is translated, except the type. | `/de/software`, `/pt/software` | the section is read | headings, steps and caption in the page's language | yes (build, 2026-11-08) |
| SW-HOW-04 | A fresh database, filled with the starting texts, gives the strip in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/software/how?lang=en`, `de`, `pt` | 200; en is the spec's copy (D28's shape); de and pt have three steps and a caption, each text non-empty | yes (integration, 2026-11-08) |
| SW-HOW-P-01 | The old arrow notation in the strip is refused. | the built page | the type reads `Page → Visitor : links(hrefs) . …` | SW-HOW-02 goes red | yes (break in the build; and a `moved301` branch added in `links.global`) |

## 6. Proof

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PROOF-01 | The page ends on the theorem that makes the protocols hold. | the built `/de/software` | the band is read | "Aus dem Paper — Session Type State Spaces Form Lattices · ICE 2026", "Warum die Protokolle halten", the statement "For every well-formed session type S, ℒ(S)/≡ is a bounded lattice." (untranslated), the home band's German evidence line | yes (build and unit, 2026-11-08; the label "Satz 15 · Reticulate Theorem" too) |
| SW-PROOF-02 | Two buttons lead on: the paper, and the research page in the same language. | any language | its buttons are read | "Read the paper (PDF)" / "Paper lesen (PDF)" / "Ler o artigo (PDF)" → the paper's PDF; "All research" / "Zur Forschung" / "Toda a investigação" → `/xx/research` | yes (build and unit, 2026-11-08) |

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PROOF-03 | A fresh database, filled with the starting texts, gives the paper's shared labels in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/shared/paper?lang=en`, `de`, `pt` | 200 with HOME-PAPER-09's fields (D30), each label non-empty; `paperTitle`, `year`, `pdfUrl` and `statements` (Theorem 15 alone, D31) the same in every language | yes (integration, 2026-11-08) |
| SW-PROOF-04 | The band's own line comes from the Software page's content in every language. | the same | `GET /api/content/software/proof?lang=en`, `de`, `pt` | 200 with `kicker`: "Why the protocols hold", "Warum die Protokolle halten", "Porque é que os protocolos se cumprem" | yes (integration, 2026-11-08) |
| SW-PROOF-05 | The band's text is easy to read in light and dark. | `/en/software` in the browser, light and dark | the band's texts are measured | each is at 4.5:1 or more against what is behind it | yes (browser, 1280, light and dark, 2026-11-08) |
| SW-PROOF-P-01 | A translated theorem is refused. | the built `/de/software` | the statement reads "Für jeden wohlgeformten Session-Typ S …" | SW-PROOF-01 goes red | yes (break in the build) |

## In the browser (after the build, `npm run acceptance:browser`)

| ID | In plain words | Given | When | Then | Covered |
|----|----------------|-------|------|------|---------|
| SW-PAGE-11 | The page fits a phone: nothing runs off the side. | a phone at 390 px, `/en/software`, `/de/software`, `/pt/software` | the page is measured | no horizontal scroll; no `<pre>` scrolls sideways | yes (browser, 2026-11-08) |
| SW-PAGE-12 | Every link on the page is easy to tap. | the same | the page's links and buttons are measured | each is at least 44 px tall | yes (browser, 2026-11-08: those in `<main>`; the bar's are SHELL-06's, the menu's SHELL-08's) |
| SW-PAGE-13 | Keyboard users get to the content first. | `/de/software`, 390 and 1280 px | Tab, then Enter | the skip link goes to `<main>` on the same page (SHELL-10 on the new page) | yes (browser, 2026-11-08) |

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

**Done 2026-11-08** (`2a0a8f6` to `b85d8a5`). Red first, each for its own reason: B1
`expected: 200 but was: 404` (after a first run that found no table, before the V2 migration);
B3 `fr` with a stray row answered 200; B2 404 in all three languages; S1 "Missing expected
rejection"; U1 `expected 'APP-NOT-FOUND' to be 'APP-SOFTWARE'`; U2 `expected '' to be 'Alexandre Zua
Caldeira — heading de'`; U3 `expected [] to deeply equal [ 'eyebrow de' ]`; A `ENOENT` on
`de/software/index.html`. Declared to the monitor: A as `writeAcceptance`, every break and restore.
Green at first and shown to bite, each break in the built page restored from a copy (md5 checked):
B3's unknown section (the query ignoring the section), A2 (`pt` moved out: SW-PAGE-P-01), A3 (the
`pt` alternate to `/pt/home`), A4 ("Alexandre Caldeira — Software"), A5 (the German intro on
`pt`), and A's two protocol rows (SW-HEAD-P-01, P-02). A6 put the three pages into the shell's
`PAGES`; SHELL-04's D19 test went red on its `/de/software#x` example, which moved to
`/de/writing#x`; SW-PAGE-P-02 (a link to `/software`) then turned SHELL-04 red.

Results: unit 216 passed, 5 skipped (31 files); scripts 4/4; `acceptance` 32/32; `acceptance:nginx`
11/11; backend `./mvnw verify` 16 integration tests; the build prerenders 23 routes. The browser
tests (`acceptance:browser`) were not run: they read the home pages only, and this slice adds no
link or control to them.

Leftovers, not built:
- **The two route-list tests** in `app.routes.spec.ts` were updated with the route in U1, not run
  red first.
- **SHELL-12** (`zc-nav-mobile.spec.ts`) failed once in a whole-suite run under load (1.7 s), then
  passed alone and in the next whole run. Watch it.
- **HOME-HERO-16** checks that the default profile runs no `R__home_hero.sql`; it does not name
  `R__software.sql`. Both live in `db/seed`, which only the `seed` profile adds.
- **The head at 390, 768 and 1280 px,** in the five glazes, light and dark: for the developer on the
  preview; it is styled from the spec, not measured.
- **The initial bundle** is 513.03 kB against the 500 kB warning budget (512.27 kB before).

## Slice 2: the lead's text and the Run line

Test list:
- **Backend:** B1 SW-LEAD-09, the seed's `software/lead` in en, de, pt (added to
  `SoftwareSeedIntegrationTest`).
- **Script:** S1 SW-PAGE-09, a lead missing in `pt` stops the snapshot, naming `software`, `lead`,
  `pt`.
- **Unit:** U1 `codeSpans()` cuts a text at its backticks into words and notation (D18); U2 it
  leaves a text without backticks whole; U3 `SessionType` shows its text in a `<pre
  translate="no">` with its caption; U4 the lead on a German page: kicker, `<h2>`, status (SW-LEAD-01);
  U5 its five block headings and texts in order, then Stack (SW-LEAD-02); U6 notation in a block is
  `<code translate="no">` (D18); U7 the protocol block shows the Run line over three lines with
  `runCaption` (SW-LEAD-04); U8 the lead has no link (SW-LEAD-08).
- **Acceptance:** A SW-LEAD-01, the outer test (en: the first section after the head); A2 SW-LEAD-02;
  A3 SW-LEAD-03 (de and pt, every text the copy); A4 SW-LEAD-04 (the Run line in en, de, pt equals
  `run.st`'s checked line, which is pinned to the agreed one); A5 SW-LEAD-07 (the result, no `%`
  in the lead); A6 SW-LEAD-08 (no `<a>` in the lead).
- **Protocol rows:** SW-LEAD-P-01 (in the built page `WRONG_RED` dropped; in `run.st` a label
  renamed), SW-LEAD-P-02 (an English block on `/de/software`), SW-LEAD-P-03 (`Lauf = …` and
  `+{ROT: …` on `/de/software`). The figure's half of P-03 comes with slice 3.

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1
        participant DB as MySQL 8 (seed R__software.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant ST as docs/notation/run.st (checked in the lab, D5)
    participant P as dist/…/l/software/index.html
    T->>API: B1: GET software/lead?lang=l
    F->>API: GET software/lead?lang=l, for l in en, de, pt
    API-->>F: 200 lead_l, or 404 → the build stops (S1)
    F->>NG: snapshot
    NG->>P: WorkLead (U4–U8): texts, code spans (U1, U2), SessionType (U3) with the Run line
    T->>ST: read the checked line, pinned to the agreed one
    T->>P: A–A6; the Run line equals the checked line (A4), P rows
```

Session type. Convention: a role that a branch never calls just ends there. The Run line is not
content: like the footer's `Zua = …` it is notation in the template, and only the test reads
`run.st`.

```
G = Build → API : get(software, lead, l) .
    API → Build : { ok200(lead_l) .
                    Build → Page : prerender(lead_l, run) .
                    Page → Visitor : lead(kicker, h2, status, blocks[question, built, protocol(run),
                                          live, result], stack) . end ,
                    missing404 . Build → CI : fail(software, lead, l) . end }
  run = checked(run.st), the same for every l

Build ↾   = API!get . API?{ ok200 . Page!prerender . end , missing404 . CI!fail . end }
Visitor ↾ = Page?lead(…) . end
Page ↾    = Build?prerender . Visitor!lead(…) . end
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 test → API | `get`, `ok200(lead_l)` | B1 |
| 2–3 F → API | `get` × 3, `{ok200, missing404}` | S1 |
| 5 NG → P | `prerender(lead_l, run)` | U1–U8 |
| 6 test → run.st | `run = checked(run.st)` | A4 (the pin) |
| 7 test → P | `lead(kicker, h2, status, blocks, stack)` | A, A2, A3, A5 |
| 7, the protocol block | `protocol(run)` | A4 |
| forbidden: `run` ≠ checked | `run = checked(run.st)` | SW-LEAD-P-01 |
| forbidden: `lead_en` on `l = de` | `ok200(lead_l)` | SW-LEAD-P-02 |
| forbidden: notation translated | `run` the same for every `l` | SW-LEAD-P-03 |
| forbidden: blocks out of order | `blocks[…]` in this order | A2 |
| forbidden: a link in the lead | `lead(…)` carries no link (D2) | A6 |

The build is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08.** Red first, each for its own reason: A (on slice 1's build) "the lead does not
follow the head"; B1 404 in all three languages; S1 "Missing expected rejection"; U1 `expected []`
(after a stub, so the red was not a missing module); U3 `expected undefined to be 'no'`; U4 `expected
[] to deeply equal [ 'kicker de' ]`; U5 no `<h3>`; U6 `expected [] to deeply equal [ 'no &{…}', … ]`;
U7 no `<pre>`. U6's first red came partly from the test reading the wrong paragraph; the test was
fixed and shown red once more against the plain-text block. Declared to the monitor: A as
`writeAcceptance`, every break and restore. Green at first and shown to bite: U2 (the empty-piece
filter taken out), U8 and A6 (a link put in), A2 (the result block moved before the live view), A3
(SW-LEAD-P-02), A4 (SW-LEAD-P-01 in the page and in `run.st`, SW-LEAD-P-03's `Lauf = …`), A5 (a
"40%" claim). A2's first run failed only because the test's reader did not decode `&amp;`; the
reader was fixed before the result was taken.

Results: unit 224 passed, 5 skipped (34 files); scripts 5/5; `acceptance` 38/38;
`acceptance:nginx` 11/11; backend `./mvnw verify` 19 integration tests; the build prerenders 23
routes. The browser tests were not run: they read the home pages only.

Leftovers, not built:
- **The initial bundle** grew to 519.27 kB (513.03 kB after slice 1): the content snapshot is
  imported in `app.config.ts`, so every page's text is in the initial bundle. Each slice adds more.
  Worth a decision before slice 4: load each page's part of the snapshot with its route.
- **Port 8081** was taken on this machine by another project's Java process; the build's backend ran
  on 8091 through an override on stdin and `CONTENT_API` from an env file, nothing in the repo
  changed. `compose.build.yml` fixes the port.
- **SW-LEAD-P-03's figure half** (`+ROT`) comes with slice 3.
- **The lead at 390, 768 and 1280 px:** one column for now; the side column (figure, screenshot)
  comes with slice 3. The Run line's three lines at 390 px are for the developer on the preview.

## Slice 3: the Run figure and the monitor screenshot

Test list:
- **Backend:** B1 SW-LEAD-09 grows by the lead's `figure`, `shotAlt` and `shotCaption` (D22).
- **Unit:** U1 `RunFigure` is an `<svg role="img">` named by its label, with the label as its
  `<figcaption>` (SW-LEAD-05); U2 its labels are exactly `Run`, `&{runTest}`, `+RED`, `+WRONG_RED`,
  `+GREEN`, `Code`, `Fix`, `Green`; U3 the action edge is solid, the three result edges dashed (the
  spec: not colour alone); U4 `MonitorShot` has the light and the dark image, each in a link to its
  own file, with the alt text, `width="1440"`, `height="900"`, `loading="lazy"`, and one caption; U5
  the lead's side column holds the figure and the shot with the lead's texts; U6 SW-LEAD-08 narrowed:
  the lead's only links go to the two screenshot files (D23).
- **Acceptance (build):** A SW-LEAD-05, the outer test (the figure's name and caption in en, de, pt,
  its labels the same in every language); A2 SW-LEAD-06's build half (both images in each page with
  the page's alt text, the links, the caption; the files are in the build); A3 SW-LEAD-08 narrowed.
- **Browser (one file, one Chromium, closed after):** C SW-LEAD-06 on `/en/software` at 1280, light
  and dark: exactly one image shows, the one that matches, and only its file is downloaded.
- **Protocol rows:** SW-LEAD-P-03's figure half (`+ROT` in the built `/de/software`, A red);
  SW-LEAD-P-04 (a break in the CSS: the dark image on a light page; and `loading="eager"`: the hidden
  one downloaded; C red).

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    participant NG as ng build (prerender)
    participant P as dist/…/l/software/index.html
    participant B as Chromium (C), light or dark
    participant F as /assets/software/reticulab-live-{light,dark}.png
    NG->>P: RunFigure (U1–U3): role=img, label_l, fixed labels; MonitorShot (U4): both images, lazy
    T->>P: A, A2, A3 (build)
    T->>B: C: open /en/software with colorScheme light | dark
    B->>B: ThemeService sets html.dark-theme (or not); CSS shows one image
    B->>F: only the shown image is fetched (lazy, the other display: none)
    T->>B: which image is displayed, which files were requested
```

Session type. Convention: a role that a branch never calls just ends there.

```
G = Build → Page : prerender(figure(label_l, labels), shot(alt_l, caption_l, light, dark)) .
    Visitor → Page : open(mode) .
    Page → Visitor : { light: show(light.png) . Visitor → Files : get(light.png) . end ,
                       dark:  show(dark.png)  . Visitor → Files : get(dark.png)  . end }
  labels = [Run, &{runTest}, +RED, +WRONG_RED, +GREEN, Code, Fix, Green], the same for every l

Visitor ↾ = Page!open(mode) . Page?{ light: Files!get(light.png) . end , dark: Files!get(dark.png) . end }
Page ↾    = Build?prerender . Visitor?open . Visitor!{ light . end , dark . end }
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 NG → P | `prerender(figure, shot)` | U1–U6 |
| 2 T → P | `figure(label_l, labels)`, `shot(alt_l, caption_l, …)` | A, A2, A3 |
| 3–4 open, mode | `Visitor → Page : open(mode)` | C (light, dark) |
| 4 show one | `{ light: show(light.png) , dark: show(dark.png) }` | C |
| 5 fetch | `get(light.png)` or `get(dark.png)`, never both | C |
| forbidden: the other image shown, or both | the branch's one `show` | SW-LEAD-P-04 |
| forbidden: the hidden image fetched | one `get` per branch | SW-LEAD-P-04 |
| forbidden: a label translated | `labels` the same for every `l` | SW-LEAD-P-03 |

The page is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08, but for one open point (D25).** Red first: A on slice 2's build (no figure); B1
(the lead without its three new texts, en, de, pt); U1 `expected undefined to be 'img'` (after a
stub); U2 no labels; U3 no dashes; U4 no images; U5 no side column. SW-LEAD-08's slice-2 tests went
red on the two screenshot links, as D23 foresaw, and were narrowed; SW-LEAD-04's reader took the
lead's three captions and now reads its own figure's. Declared to the monitor: A as
`writeAcceptance`, every break and restore. Green at first and shown to bite: U6 (a write-up link),
A2 (an English alt text on `pt`; a first try by `sed` was refused and broke nothing, so it was done
again by an edit), SW-LEAD-P-03's figure half (`+ROT`), C (SW-LEAD-P-04: the dark image not hidden by
default, a break in the source and a rebuild; the same break in the prerendered page's `<style>` did
not bite, because after hydration the component's styles come from its script).

**Found by C, open (D25):** on a dark page the light screenshot is downloaded too (about 150 kB).
Before Angular sets `html.dark-theme`, the page is light, and the lazy light image is close enough
to the viewport to load. The image shown is right in both themes; C checks only that until D25 is
decided.

Results: unit 232 passed, 5 skipped (36 files); scripts 6/6; `acceptance` 41/41; `acceptance:nginx`
11/11; browser C 2/2 (the shell's browser tests were not run: they read the home pages only); backend
`./mvnw verify` 19 integration tests; the build prerenders 23 routes; initial bundle 510.81 kB.

Leftovers:
- **The design hook** flags `monitor-shot.ts` with "broken-image": a false positive, the `src` is a
  binding (`[src]="file(mode)"`) to the two real files, checked by U4 and A2. The narrow ignore
  needs a command this session may not run; it is left standing.
- **The figure and the side column at 390, 768 and 1280 px,** in light and dark: for the developer on
  the preview; drawn and styled by eye, the figure's contrast not measured.
- **Port 8081** was taken again; the build's backend ran on 8091 (stdin override), as in slice 2.

## Slice 4: More work

Test list:
- **Backend:** B1 SW-WORK-06, the seed's `software/work` in en, de, pt (in `SoftwareSeedIntegrationTest`).
- **Script:** S1 SW-PAGE-09, a `work` missing in `de` stops the snapshot, naming `software`, `work`, `de`.
- **Unit (`WorkRows`):** U1 an `<h2>` and one row per piece, in the content's order, each with its
  kicker, `<h3>` title, text and stack (SW-WORK-01); U2 each row's links, label and target
  (SW-WORK-02 to 04); U3 a link outside the site opens in a new tab with `rel="noopener noreferrer"`,
  as the footer's do, and the paper does not (D27).
- **Acceptance (build):** A SW-WORK-01, the outer test (en: the section after the lead, three rows in
  order: reticulateP, Kita Dienstplan, Casa Azul website); A2 SW-WORK-02 to 04 (each row's links in
  en, de, pt; the paper's file is in the build); A3 SW-WORK-05 (de and pt: kicker, text and the Casa
  Azul title translated; names, stacks and targets the same as in en).
- **Protocol rows:** SW-WORK-P-01 (the Embassy line put back as a fourth row; Kita Dienstplan moved
  first; A red), SW-WORK-P-02 (a repository link on the reticulateP row; A2 red).

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1
        participant DB as MySQL 8 (seed R__software.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant P as dist/…/l/software/index.html
    T->>API: B1: GET software/work?lang=l
    F->>API: GET software/work?lang=l, for l in en, de, pt
    API-->>F: 200 work_l, or 404 → the build stops (S1)
    F->>NG: software.json
    NG->>P: WorkRows (U1–U3): heading, rows in order, links
    T->>P: A, A2, A3, P rows
```

Session type. Convention: a role that a branch never calls just ends there.

```
G = Build → API : get(software, work, l) .
    API → Build : { ok200(work_l) .
                    Build → Page : prerender(work_l) .
                    Page → Visitor : work(heading, rows[reticulateP, kitaDienstplan, casaAzul]) .
                    Visitor → Page : { paper . end , repo(kitaDienstplan) . end ,
                                       site(casaAzul) . end , repo(casaAzul) . end , stay . end } ,
                    missing404 . Build → CI : fail(software, work, l) . end }

Visitor ↾ = Page?work(…) . Page!{ paper . end , repo(kita) . end , site(casa) . end ,
                                  repo(casa) . end , stay . end }
Page ↾    = Build?prerender . Visitor!work(…) . Visitor?{ … }
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 test → API | `get`, `ok200(work_l)` | B1 |
| 2–3 F → API | `get` × 3, `{ok200, missing404}` | S1 |
| 5 NG → P | `prerender(work_l)` | U1–U3 |
| 6 test → P | `work(heading, rows[…])` | A, A3 |
| 6, the links | the Visitor's choice `{paper, repo(kita), site(casa), repo(casa), stay}` | A2, U2, U3 |
| forbidden: a fourth row, or another order | `rows[reticulateP, kitaDienstplan, casaAzul]` | SW-WORK-P-01 |
| forbidden: `repo(reticulateP)` | not a branch of the choice (D2) | SW-WORK-P-02 |

The page is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08.** Red first: A on slice 3's build ("More work does not follow the lead"); B1 404
in all three languages; S1 "Missing expected rejection"; U1 no heading (after a stub); U2 no links;
U3 no `target` or `rel`. Declared to the monitor: A as `writeAcceptance`, every break and restore.
Green at first and shown to bite: SW-WORK-P-01 (the Embassy line as a fourth row; Kita Dienstplan
put first), A2 (SW-WORK-P-02: a repository link on reticulateP), A3 (the English Casa Azul title on
`pt`). The `<h3>` first had `translate="no"`, taken off before the commit: the Casa Azul title is
translated text.

Results: unit 242 passed, 5 skipped (37 files); scripts 7/7; `acceptance` 48/48;
`acceptance:nginx` 11/11; browser `software-shot` 2/2 (its page changed; the shell's browser tests
read the home pages only); backend `./mvnw verify` 22 integration tests; the build prerenders 23
routes; initial bundle 510.81 kB.

Leftovers:
- **The rows at 390, 768 and 1280 px,** in light and dark: for the developer on the preview; the
  links' 44 px height is measured in the browser with SW-PAGE-12 (slice 7).
- **Port 8081** was taken again; the build's backend ran on 8091 (stdin override).

## Slice 5: How I work

Test list:
- **Backend:** B1 SW-HOW-04, the seed's `software/how` in en, de, pt (in `SoftwareSeedIntegrationTest`).
- **Script:** S1 SW-PAGE-09, a `how` missing in `pt` stops the snapshot, naming `software`, `how`, `pt`.
- **Unit (`HowStrip`):** U1 an `<h2>` and an `<ol>` of three steps, in order, each with its number,
  `<h3>` and sentence (SW-HOW-01); U2 the links protocol in a `SessionType`: a `<pre translate="no">`
  holding exactly the checked line, one line that wraps at spaces, with the caption (SW-HOW-02).
- **Acceptance (build):** A SW-HOW-01, the outer test (en: the section after More work, its heading
  and three steps); A2 SW-HOW-02 (the global type in en, de, pt is exactly `links.global`'s checked
  line, which is pinned to the agreed one; the caption in the page's language); A3 SW-HOW-03 (de and
  pt: heading, steps and caption translated).
- **Protocol rows:** SW-HOW-P-01 (the old `Page → Visitor : links(hrefs) . …` in the built
  `/de/software`; a branch renamed in `links.global`; A2 red).

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1
        participant DB as MySQL 8 (seed R__software.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant LG as docs/notation/links.global (checked in the lab, D5)
    participant P as dist/…/l/software/index.html
    T->>API: B1: GET software/how?lang=l
    F->>API: GET software/how?lang=l, for l in en, de, pt
    API-->>F: 200 how_l, or 404 → the build stops (S1)
    F->>NG: software.json
    NG->>P: HowStrip (U1, U2): heading, three steps, SessionType with the global type
    T->>LG: read the checked line, pinned to the agreed one
    T->>P: A, A2, A3, P rows
```

Session type. Convention: a role that a branch never calls just ends there. The global type is
notation in the template, like the Run line (D19); only the test reads `links.global`.

```
G = Build → API : get(software, how, l) .
    API → Build : { ok200(how_l) .
                    Build → Page : prerender(how_l, links) .
                    Page → Visitor : how(heading, steps[protocol, testFirst, forbiddenRed],
                                         type = links, caption) . end ,
                    missing404 . Build → CI : fail(software, how, l) . end }
  links = checked(links.global), the same for every l

Visitor ↾ = Page?how(…) . end
Page ↾    = Build?prerender . Visitor!how(…) . end
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 test → API | `get`, `ok200(how_l)` | B1 |
| 2–3 F → API | `get` × 3, `{ok200, missing404}` | S1 |
| 5 NG → P | `prerender(how_l, links)` | U1, U2 |
| 6 test → links.global | `links = checked(links.global)` | A2 (the pin) |
| 7 test → P | `how(heading, steps, caption)` | A, A3 |
| 7, the type | `type = links` | A2 |
| forbidden: another notation, or a changed file | `links = checked(links.global)` | SW-HOW-P-01 |
| forbidden: the type translated | `links` the same for every `l` | A2 |

The page is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08.** Red first: A on slice 4's build ("How I work does not follow More work"); B1
404 in all three languages; S1 "Missing expected rejection"; U1 no heading (after a stub; a first
run did not compile, because a fixture edit had not applied: the slice-4 insert had left `const
inEvery =<T>(` without its space, now fixed); U2 no `<pre>`. Declared to the monitor: A as
`writeAcceptance`, every break and restore. Green at first and shown to bite: A2 (SW-HOW-P-01: the
old arrow notation in the built `/de/software`; a `moved301` branch in `links.global`, red at the
pin), A3 (the English "Protocol first" on `pt`).

Results: unit 244 passed, 5 skipped (38 files); scripts 8/8; `acceptance` 51/51;
`acceptance:nginx` 11/11; browser `software-shot` 2/2; backend `./mvnw verify` 25 integration
tests; the build prerenders 23 routes; initial bundle 510.81 kB.

Leftovers:
- **The type at 390 px** wraps at its spaces (`pre-wrap`); how it reads on a phone, and the three
  steps in a row from 900 px, are for the developer on the preview.
- **Port 8081** was taken again; the build's backend ran on 8091 (stdin override).

## Slice 6: the proof band

Test list:
- **Backend:** B1 SW-PROOF-03 (and HOME-PAPER-09 in part), the seed's `shared/paper` in en, de, pt, in
  a new `SharedSeedIntegrationTest`; B2 SW-PROOF-04, the seed's `software/proof`.
- **Script:** S1 SW-PAGE-09, a `shared/paper` missing in `pt` stops the snapshot, and it is written
  as `shared.json`; S2 a `software/proof` missing in `de` stops it.
- **Unit (`TheoremBand`, `common/theorem-band/`, shared with the home band later):** U1 the paper
  line in the page's language ("eyebrow — paperTitle · ICE year") and the kicker it is given; U2 the
  theorem: its label ("Satz 15 · Reticulate Theorem") and its statement as stored, then the evidence
  line; U3 two buttons, the paper's PDF and All research → `/xx/research`. Route: U4 SW-PAGE-14,
  `/de/software` brings the shared text with its route (`SHARED_CONTENT`).
- **Acceptance (build):** A SW-PROOF-01, the outer test (de: the last section before the footer is
  the band: paper line, kicker, label, the untranslated statement, the German evidence line); A2
  SW-PROOF-02 (the two buttons in en, de, pt); SW-PAGE-14 stays green (the Software page still
  downloads no home text).
- **Browser (one file, one Chromium, closed after):** C SW-PROOF-05, the band's texts at 4.5:1 or
  more, light and dark.
- **Protocol rows:** SW-PROOF-P-01 (a German statement on `/de/software`, A red).

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1, B2
        participant DB as MySQL 8 (seed R__shared.sql, R__software.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant P as dist/…/l/software/index.html
    T->>API: B1: GET shared/paper?lang=l; B2: GET software/proof?lang=l
    F->>API: GET shared/paper and software/proof, for l in en, de, pt
    API-->>F: 200, or 404 → the build stops (S1, S2)
    F->>NG: shared.json, software.json
    NG->>P: the Software route provides SHARED_CONTENT (U4); TheoremBand (U1–U3)
    T->>P: A, A2, SW-PAGE-14, P row
    T->>P: C in Chromium: the band's contrast, light and dark
```

Session type. Convention: a role that a branch never calls just ends there.

```
G = Build → API : get(shared, paper, l) . API → Build : { ok200(paper_l) . Build → API : get(software, proof, l) .
        API → Build : { ok200(proof_l) .
                        Build → Page : prerender(paper_l, proof_l) .
                        Page → Visitor : band(paperLine_l, kicker_l, label_l, statement, evidence_l,
                                              read → pdfUrl, all → /l/research) .
                        Visitor → Page : { read . end , all . end , stay . end } ,
                        missing404 . Build → CI : fail(software, proof, l) . end } ,
      missing404 . Build → CI : fail(shared, paper, l) . end }
  statement = Theorem 15's text, the same for every l (D31)

Visitor ↾ = Page?band(…) . Page!{ read . end , all . end , stay . end }
Page ↾    = Build?prerender . Visitor!band(…) . Visitor?{ … }
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 test → API | `get(shared, paper)`, `get(software, proof)`, `ok200` | B1, B2 |
| 2–3 F → API | both `get` × 3, `{ok200, missing404}` | S1, S2 |
| 5 NG → P | `prerender(paper_l, proof_l)` | U1–U4 |
| 6 test → P | `band(paperLine_l, kicker_l, label_l, statement, evidence_l)` | A |
| 6, the buttons | `read → pdfUrl`, `all → /l/research`, the Visitor's choice | A2, U3 |
| 7 the band read | `band(…)` legible | C |
| forbidden: the statement translated | `statement` the same for every `l` | SW-PROOF-P-01 |
| forbidden: the home text on the Software page | `paper_l` from `shared.json`, not `home.json` | SW-PAGE-14 |

The page is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08.** Red first: A on slice 5's build (the band is not the last section); B1 and B2
404 in all three languages; S1 and S2 "Missing expected rejection"; U1 no paper line (after a stub);
U2 no label, statement or evidence; U3 no buttons; U4 `NullInjectorError` for `SHARED_CONTENT` once
the band was on the page, green when the Software route provided `@page-content/shared`. Declared to
the monitor: A as `writeAcceptance`, every break and restore. Green at first and shown to bite: A
(SW-PROOF-P-01: the German statement), A2 (the research button to `/en/research` on `pt`), C (the
light band's text set to `--zc-text-muted` in the source, rebuilt). SW-PAGE-14 stayed green: the
Software page still downloads no home text.

Two slips, each fixed in its own commit: U4's commit was made before the whole suite's result was
read, and `software.spec.ts` failed there (NG0201, the band's router link needed `provideRouter`);
and the first build failed its `satisfies` check, because the snapshot's JSON types a statement's
`kind` as `string`, not the literal union (now `string`).

Results: unit 247 passed, 5 skipped (39 files); scripts 10/10; `acceptance` 53/53;
`acceptance:nginx` 11/11; browser `software-band` 2/2 and `software-shot` 2/2 (the shell's browser
tests read the home pages, whose tokens did not change); backend `./mvnw verify` 31 integration
tests; the build prerenders 23 routes; initial bundle 511.13 kB (510.81 before: the new tokens in
the global styles).

Leftovers:
- **The home band** reuses `TheoremBand` and `shared/paper` when it is built: its route provides
  `SHARED_CONTENT` then (D33), and the three other statements come from the paper (D31).
- **The contrast reader** is now in two browser tests (footer, band); a third user would be the
  time to share it.
- **The band at 390 and 768 px,** and the Fraunces 400 the spec asks for the statement (not loaded
  yet: `index.html` links Fraunces 500 and 600 only), are for the developer on the preview.
- **Port 8081** was taken again; the build's backend ran on 8091 (stdin override).

## Slice 7: open the page

Test list:
- **Unit:** U1 SW-PAGE-10, the desktop menu on a German page: Startseite, Über mich, Software,
  Forschung, Laufen, Software before Forschung (D13); U2 SW-PAGE-07, on `/de/software` its link, and
  only it, carries `aria-current="page"` (D34); U3 the phone menu lists Software before Research and
  marks the current page the same way.
- **Acceptance (build):** A SW-PAGE-07, the outer test (the built `/pt/software`: the menu's Software
  link → `/pt/software` with `aria-current="page"`, no other menu link); A2 SW-PAGE-10 (the built
  `/de/home`: Software → `/de/software`, before Forschung); A3 SW-PAGE-04 (the sitemap: the 18 pages,
  each built; HOME-PAGE-07's test moves from 15 to 18); A4 SW-PAGE-15 (the font link asks for
  Fraunces 400), a step of its own.
- **nginx (the web image):** N SW-PAGE-06, `/en/software`, `/de/software`, `/pt/software` answer `200`
  with no redirect, `/de/software/` answers `301` to `/de/software`; HOME-PAGE-09's count moves to 18.
- **Browser (each file one Chromium, closed after):** B1 SW-PAGE-11 (390 px, en, de, pt: no horizontal
  scroll, no `<pre>` scrolls sideways); B2 SW-PAGE-12 (390 px: every link and button in `<main>` at
  least 44 px tall); B3 SW-PAGE-13 (`/de/software` at 390 and 1280: Tab, then Enter, moves focus to
  `<main>` on the same page), in a new `software-phone.test.mjs`. `shell-phone.test.mjs` (the phone
  menu's links, SHELL-08) is updated for Software and runs again; `shell-keyboard`, `shell-footer`,
  `software-shot`, `software-band`, `theme-paint` run again because the menu is on every page.
- **Protocol rows:** SW-PAGE-P-03 (a second menu link marked current, A red), SW-PAGE-P-04
  (`/de/writing` in the sitemap, A3 red).

```mermaid
sequenceDiagram
    autonumber
    actor V as Visitor (and the tests)
    participant M as Menu (ContentService.navItems, i18n nav)
    participant P as dist/…/l/software/index.html
    participant S as sitemap.xml
    participant N as nginx (web image)
    M->>P: Software before Research, the current page marked (U1–U3, A, A2)
    V->>S: the 18 pages, each built (A3)
    V->>N: GET /l/software (N)
    N-->>V: 200, no redirect; /l/software/ → 301 /l/software
    V->>P: Chromium 390: fits, links ≥ 44 px, Tab → skip link → main (B1–B3)
```

Session type: the visitor's path from any page, in the convention of `shell.md` (a role that a
branch never calls just ends there). Before this slice the menu had no Software link; the change is
in what the visitor can choose, so it is a change of behaviour, not a refactor.

```
G = Page → Visitor : menu(items = [home, about, software, research, running], current = p_l) .
    Visitor → Nginx : { get(/l/software) . Nginx → Visitor : ok200(softwarePage, lang l) . end ,
                        get(/l/software/) . Nginx → Visitor : moved301(/l/software) .
                            Visitor → Nginx : get(/l/software) . Nginx → Visitor : ok200 . end ,
                        stay . end }
  Crawler → Nginx : get(/sitemap.xml) . Nginx → Crawler : ok200(18 urls, each built) . end

Visitor ↾ = Page?menu(…) . Nginx!{ get(/l/software) . Nginx?ok200 . end , get(/l/software/) .
            Nginx?moved301 . Nginx!get . Nginx?ok200 . end , stay . end }
Nginx ↾   = Visitor?{ get(/l/software) . Visitor!ok200 . end , get(/l/software/) . Visitor!moved301 .
            Visitor?get . Visitor!ok200 . end , stay . end }
```

| Arrow | Step in G | Rows |
|---|---|---|
| 1 M → P | `menu(items, current)` | U1–U3, A, A2 |
| 2 sitemap | `Crawler … ok200(18 urls, each built)` | A3 |
| 3–4 nginx | `get(/l/software)`, `ok200`; `get(/l/software/)`, `moved301` | N |
| 5 the page in Chromium | `ok200(softwarePage, lang l)` read on a phone and by keyboard | B1–B3 |
| forbidden: two current links | `current = p_l`, one page | SW-PAGE-P-03 |
| forbidden: a sitemap URL not built | `each built` | SW-PAGE-P-04 |
| forbidden: a link without the prefix | `items` are `/l/x` (SHELL-04) | SW-PAGE-P-02 (covered) |

The site is read-only: no repeat, stale-token or race rows.

**Done 2026-11-08; the page is open.** Red first: A on slice 6's build (no Software link, nothing
marked current); U1 four links, not five; U2 and U3 no `aria-current`; A3 the three software URLs
missing from the sitemap; A4 Fraunces 400 missing (a first version read the font link, which the
production build inlines away: `undefined`, the wrong reason, fixed before the red was taken).
Declared to the monitor: A as `writeAcceptance`, every break and restore. Green at first and shown
to bite: A (SW-PAGE-P-03), A2 (the Software link taken out of the built `/de/home`), A3's
SW-PAGE-P-04 (`/de/writing` in the built sitemap), N (the built `pt/software` moved out), B1 and B2
(SessionType not wrapping, the work links without 44 px, in the source, rebuilt), B3 (the desktop
bar's skip link as a bare `#main-content`, in the source, rebuilt; a break of `main`'s `id` in the
built page did not bite, the shell is rendered again after hydration).

Older tests that pinned the five-link menu changed with D13: seven unit tests (desktop, phone,
`ContentService`), SHELL-08 A1 and SHELL-05b in the browser, HOME-PAGE-07 (15 → 18 URLs) and
HOME-PAGE-09's count in nginx (changed before a run, so its red on 15 was not seen; the first commit
message said otherwise and was corrected before any push).

Results: unit 250 passed, 5 skipped (39 files); scripts 10/10; `acceptance` 56/56;
`acceptance:nginx` 12/12; browser, one Chromium per file: `software-phone` 6/6, `shell-phone` 33/33,
`shell-keyboard` 45/45, `shell-footer` 6/6, `software-shot` 2/2, `software-band` 2/2, `theme-paint`
5/5; the build prerenders 23 routes; initial bundle 511.39 kB. The backend was not touched.

Leftovers:
- **SHELL-11** still waits for the Writing page: Texte, and its order (Software, Forschung, Texte,
  Über mich, without Home and Running, D13).
- **SW-PAGE-06 on `next`** (`curl` after the push), by hand, as HOME-PAGE-05's test 8.
- **The menu's ochre underline** on the current page, and Software's place in it, at 768 and 1280 px:
  for the developer on the preview.
- **The Portuguese copy** of the whole page is still a draft nobody has read (D16).

## Decisions

Taken in slice 7's plan on 2026-11-08 (the developer may change them):

- **D34. The menus mark the current page with `aria-current="page"`,** on every page, as the
  language links do, and show it with the language codes' ochre underline (the spec). Today only a
  class marks it.
- **D35. The label** is a new `nav.software` key: "Software" in en, de and pt.

Taken in slice 6's plan on 2026-11-08, following the home spec (the developer may change them):

- **D32. The band's colours** are new tokens, as `home-spec.md` names them, prefixed like the
  footer's (`--zc-foot-*`): `--zc-on-accent`, `--zc-band-bg`, `--zc-band-fg`, `--zc-band-btn`,
  `--zc-band-btn-fg` (light: the accent with on-accent text;
  dark: the raised surface with heading text), checked in the browser by C. Its buttons are plain
  `<a>`, 44 px tall, radius 2 px, filled and outlined, not Material (home spec, `Button`).
- **D33. The home route** provides `SHARED_CONTENT` when the home band is built; today the home
  page has no band and downloads none of it.

Decided by the developer on 2026-11-08, for slice 6:

- **D30. Shared text has a page of its own.** The paper's labels live at `GET
  /api/content/shared/paper?lang=xx`, with HOME-PAPER-09's fields; the snapshot writes
  `shared.json`, read by the Software route now and by the home route when the home band is built.
  HOME-PAPER-09's address changed from `home/paper` to `shared/paper` (noted in `home.md`). The
  Software page's own line, "Why the protocols hold", is in `software/proof`.
- **D31. `statements` holds Theorem 15 alone for now.** The home band adds Definition 6, Lemma 8 and
  Proposition 18 from the paper when it is built; their texts are not invented here.

Taken in slice 5's plan on 2026-11-08, following the spec and D5 (the developer may change them):

- **D28. `software/how`** is one object: `heading`, `steps` (three, each `title` and `text`, in the
  page's order) and `caption`. The step's number is drawn by the page, not stored.
- **D29. `links.global`** holds the global type as shown on the page, after `#` comment lines that
  say where and how it was checked (D5), read the same way as `run.st` (D17). It is a whole global
  type, not a line of a bigger one.

Taken in slice 4's plan on 2026-11-08, following the spec (the developer may change them):

- **D26. `software/work`** is one object: `heading` and `rows`, an array in the page's order, each row
  `id`, `kicker`, `title`, `text`, `stack` and `links` (`label`, `href`). The names reticulateP and Kita
  Dienstplan, the stacks and the targets are the same in every language; the Casa Azul title is
  translated (`work.casa.title`).
- **D27. Links outside the site** (GitHub, casa-azul-berlin.de) open in a new tab with `rel="noopener
  noreferrer"`, as the footer's GitHub and LinkedIn do; the paper's PDF opens in the same tab.

Decided by the developer on 2026-11-08:

- **D25. The light screenshot downloaded on a dark page: option 1.** A few lines of script in
  `index.html`'s `<head>` set `html.dark-theme` before the page paints, by the site's own rule (the
  saved choice, `zc-theme`, else the device's setting), so a dark page downloads only the dark image
  and no page flashes light first. A test keeps the script's rule and `ThemeService`'s the same: one
  table of cases (`theme-rule.cases.json`), read by the service's spec and by a build test that runs
  the built page's script over it. This is THEME-10 in `docs/examples/theme.md` for today's two
  themes (the living glaze is not built). The design checker's "broken image" warning stays as it is.

  Test list: C2 (browser, the outer test, declared) SW-LEAD-06: a dark page downloads only the dark
  screenshot, the check C left open, red first; C3 (browser) THEME-10: with Angular's script blocked,
  `<html>` already has `dark-theme` on a dark device, and not on a dark device whose saved choice is
  light; C4 (browser) THEME-10: with JavaScript off, the page is light; A (build) THEME-10: the built
  page's head script gives the table's answer for every case; U (unit) THEME-10: `ThemeService` gives
  the same table's answers.

  **Done 2026-11-08.** C2 went red first (`downloaded: light,dark`) and green once the head script was
  in. A went red on all four pages (no head script). U and C3, C4 were green at first and shown to
  bite: U by `ThemeService` ignoring the device's setting; C3 by the head script's `addClass` taken
  out of the built page (both dark cases red); C4 by `class="dark-theme"` on the built `<html>`. C3's
  first run failed in the test itself (an unawaited `page.evaluate` inside `try … finally`). All the
  browser tests ran, one file at a time, since the script is on every page: `software-shot` 2/2,
  `theme-paint` 5/5, `shell-footer` 6/6, `shell-keyboard` 45/45, `shell-phone` 33/33. Unit 239
  passed, 5 skipped; scripts 6/6; `acceptance` 45/45; `acceptance:nginx` 11/11; the build prerenders
  23 routes. The design checker's "broken image" warning on `monitor-shot.ts` is left as it is.

Taken in slice 3's plan on 2026-11-08, following the spec (the developer may change them):

- **D22. The lead grows by three texts:** `figure` (the figure's name and caption), `shotAlt`,
  `shotCaption`, the spec's copy in en, de and pt.
- **D23. SW-LEAD-08 is narrowed to its own words:** no link to the lab, no repository, no write-up.
  The screenshot's link to its full-size file (SW-LEAD-06, the spec's `MonitorShot`) is allowed;
  slice 2's tests refused every link and are narrowed to "only the two screenshot files".
- **D24. Light or dark** is the one theme the site has today, `html.dark-theme` from `ThemeService`
  (the five glazes of the spec are not built). Both images are in the page; CSS shows one, and the
  other is never downloaded (`loading="lazy"` and `display: none`). Without JavaScript the page is
  light and shows the light image.

Taken in slice 2's plan on 2026-11-08, following D5, D11 and the spec (the developer may change
them):

- **D17. `run.st`** holds the Run line as shown on the page, after `#` comment lines that say it
  is line 10 of the lab's `types/agent/workflow/ext-generic.st` (checked there, D5), not a whole
  program. reticulateP's parser has no comments; its own fixture loader skips `#` lines and takes
  the first other line, and the tests read `run.st` the same way. The file is not meant for
  `reticulatep.cli -f`: on its own, `Code`, `Fix` and `Green` are not defined.
- **D18. Notation inside a sentence** is written between backticks in the content, as in the
  spec's copy (`` `&{…}` ``, `` `reticulab serve` ``), and shown as `<code translate="no">`.
- **D19. `software/lead`** is one object: `kicker`, `title`, `status`, `labels` (`question`,
  `built`, `protocol`, `live`, `result`, `stack`), `question`, `built`, `built2`, `protocol`,
  `runCaption`, `live`, `result`, `stack`. The stack is the same in every language. The figure's
  and the screenshot's texts come with slice 3. The Run line is in the template, not the content.

Decided by the developer on 2026-11-08, after slice 2 (its leftover on the initial bundle):

- **D20. Each page loads only its own text, with its route,** built as its own small step before
  slice 3. The pages' texts and the build's stop on a missing language stay as they are. Measured
  before, on slice 2's build: the initial bundle is 519.27 kB (the build's "Initial total", raw),
  `main-*.js` 88.5 kB, and `main-*.js` holds the home hero and the Software page's texts in all three
  languages, so `/en/home` downloads the Software page's text too.
- **D21. How (2026-11-08): the short name `@page-content/<page>`.** The snapshot script writes one
  file per page (`src/app/content/generated/<page>.json`, git-ignored). `tsconfig.app.json` points
  `@page-content/*` at those files, `tsconfig.spec.json` at small test files
  (`src/app/content/testing/<page>.ts`, from today's test text), so the specs and CI's order stay as
  they are. Each page's route file imports its text and provides it to the page (`HOME_CONTENT`,
  `SOFTWARE_CONTENT`). Its test: SW-PAGE-14, below.

| ID | English |
|----|---------|
| SW-PAGE-14 | Each page downloads only its own text: the home page carries none of the Software page's, and the Software page none of the home page's. |

| ID | Given | When | Then | Covered |
|----|-------|------|------|---------|
| SW-PAGE-14 | the built site | the files `/en/home` and `/en/software` load at once are read (`<script>`, `modulepreload`, and their static imports) | each page's own text is among them; none of `/en/home`'s holds a Software text ("A monitor that holds a coding agent to its TDD protocol"), none of `/en/software`'s the home hero's sentence ("I build software, and prove its protocols hold.") | yes (build and unit, 2026-11-08) |

**Done 2026-11-08.** Red first: SW-PAGE-14 on slice 2's build, `main-*.js` holding both texts
(its first sentence, "Case study · AI agents", could not be found at all: the minifier escapes `·`
in the scripts, so the test uses ASCII sentences); the script's one-file-per-page test (no files);
the route test (`NullInjectorError` with no content at the root). A build without the snapshot
still stops (`Could not resolve "@page-content/home"`), and the unit tests ran with no fetched files
on this machine, as in CI. The check that each page's own text is among its files was added after
the first green and found that `/en/home` had lost its preload: `/` and `/xx/home` shared one loader
function. Each route now has its own inline `import()`, and `/en/home` preloads its chunk again.

Measured on the build: the initial bundle 519.27 kB before, 510.65 kB after (raw; 128.54 kB
transferred); `main-*.js` 88.5 kB before, 80.00 kB after. Each page's text now sits in its own lazy
chunk.

Leftovers:
- **Still 10.65 kB over the 500 kB warning budget:** that is the app itself (512.27 kB before any
  page text came from the API), not the content.
- **`/` has no preload of the home chunk** in the server's manifest (the root route, `pathMatch:
  'full'`); the page is prerendered, and the chunk loads once Angular starts. Whether `/` had one
  before is not known: its text was in `main-*.js` then.
- **SHELL-12** timed out once more in a whole-suite run right after a build (1.8 s), and passed
  alone and in the next whole run.

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
