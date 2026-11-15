# Examples: About page

Status: **agreed with the developer on 2026-11-15:** option B (AB-D10 in
`docs/mockups/about/about-notes.md`), the 51 cases, the four slices, and D1 to D7 as recommended (the
first option of each). Slices 1 and 2 can be built now. Slice 3 waits for Zua's facts, which come in
a later turn and become the seed; they are not cases. **Slice 1 is built (2026-11-15)**, below.

The About page in three languages, at `/en/about`, `/de/about` and `/pt/about`. It is Zua's CV told
as a story along the route Piri → Estremoz → Lisbon → Berlin, with the route beside the chapters.
Design: `docs/mockups/about/about-spec.md`, with the mock-up (`about.html`, `#opt=b`) and its notes.
This file replaces the old page that sits behind the route.

**Already there,** so not cases here:
- the route `about` (`app.routes.ts`);
- the sitemap entries (HOME-PAGE-07);
- nginx's `200` and the old path's `301` (HOME-PAGE-05, 09, 10);
- the menu link (SHELL-11) and the phone menu's path to the page (SHELL-08 A5, SHELL-12);
- the language links (SHELL-01 to 03) and the de and pt language check (LANG-01 to 05, which
  already reads `about`);
- the notation fonts check (SHELL-13).

Each of them must stay green on the new page.

Sections, in build order:
1. **Page frame** (ABOUT-01 to 07): the new page behind the existing route.
2. **Head** (ABOUT-08 to 11).
3. **The route** (ABOUT-12 to 14): the `<nav>` as prerendered.
4. **Chapters** (ABOUT-15 to 28): the four chapters from the content API, Lisbon's texts, Berlin's
   threads, `#running`, the races, Strava; no gap marker.
5. **In the browser** (ABOUT-29 to 41): the route as a column and as a bar, the reading marker,
   reduced motion, no JavaScript, phone, keyboard, contrast.

Not in this file: the header, language links and footer (`shell.md`), the colours (`theme.md`), the
story's wording (content). All labels are in the spec's copy table; a case names a key and gives a
language as its example.

**How the story's text is checked:** a case checks that each chapter shows the paragraphs stored for
it, in its language, in order, as text. It does not check what they say. The words are Zua's, and the
seed holds them. The one rule on the words is a refused path: no gap marker reaches a page.

## Who reads it (from `docs/design.md`)

- **Hiring managers and recruiters** (phone or laptop): the path, the work, the training; the CV
  once the file exists.
- **Researchers:** where the background comes from (Lisbon, the 2007 to 2010 texts, ICE 2026).
- **Teams building AI agents:** whom they would work with.

## 1. Page frame

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| ABOUT-01 | The About page is the new page in all three languages. | the about content in en, de and pt | the site is built | `/en/about/index.html`, `/de/about/index.html`, `/pt/about/index.html` exist with `<html lang>` en, de, pt, each with `app-page-head` | build (acceptance) and unit | yes (build and unit, slice 1) |
| ABOUT-02 | The browser tab names the page in its language. | the built pages | they are read | `<title>` is "Alexandre Zua Caldeira — About", "— Über mich", "— Sobre" | build and unit | yes (build and unit, slice 1) |
| ABOUT-03 | Search engines learn that the three pages are one page in three languages. | the built `/de/about` | it is read | `<link rel="alternate">` for en, de, pt to `https://zuacaldeira.com/{en,de,pt}/about`, and `x-default` to `/en/about` | build | yes (build, slice 1) |
| ABOUT-04 | The header shows About as the page you are on. | the built `/de/about` | the main navigation is read | its "Über mich" link goes to `/de/about` with `aria-current="page"`; no other link has it | build | yes (build, slice 1) |
| ABOUT-05 | A missing German text stops the build instead of showing English. | no `about` section stored for de | the snapshot is taken | it fails, naming page `about`, the section and `de`; nothing is built (as WR-PAGE-09) | the snapshot script's test | yes (the snapshot script's test, slice 1) |
| ABOUT-06 | The page downloads only its own text. | the built site | the files `/en/about` loads at once are read | its own text is among them; none holds the home hero's sentence, the Software lead's title, the Writing intro or the Research intro; and no other page's files hold the About intro (as RS-PAGE-06) | build and unit (the route provides `ABOUT_CONTENT`) | yes (build and unit, slice 1) |
| ABOUT-07 | The old page is gone. | the built pages in en, de, pt | `<main>` is read | no `app-section-header`; none of the old headings ("The Journey", "Berlin Chapter", "Beyond Work"; "Der Weg" as a heading, "Berliner Kapitel", "Neben der Arbeit"; "O percurso" as a heading, "Capítulo Berlim", "Para além do trabalho"); no `<strong>`; the `about` block is gone from `Translations` | build; the compiler for the i18n block | yes (build; the compiler for the i18n block, slice 1) |
| ABOUT-P-01 | An About page in only one or two languages is refused. | the build | a language's about page is missing | ABOUT-01 goes red, naming the language | break in the build | yes (break in the build, slice 1) |
| ABOUT-P-02 | An old heading put back is refused. | the built `/en/about` | "Berlin Chapter" is put in `<main>` | ABOUT-07 goes red | break in the build | yes (break in the build, slice 1) |

## 2. Head

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| ABOUT-08 | The page opens with the route, its name and one sentence. | the built `/en/about` | the head is read | eyebrow "Piri → Estremoz → Lisbon → Berlin", `<h1>` "About", `head.intro` en; exactly one `<h1>` | build | yes (build, slice 1) |
| ABOUT-09 | The German and Portuguese heads read in their language. | the built `/de/about`, `/pt/about` | the head is read | "Piri → Estremoz → Lissabon → Berlin", "Über mich"; "Piri → Estremoz → Lisboa → Berlim", "Sobre"; each `head.intro` in its language | build and unit | yes (build and unit, slice 1) |
| ABOUT-10 | When the site asks for the German head, it gets it exactly as stored. | `about/head` stored for de | `GET /api/content/about/head?lang=de` | 200 with the stored JSON as it is | integration | yes (integration, slice 1) |
| ABOUT-11 | A fresh database gives the head in every language, none empty. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/about/head?lang=en`, `de`, `pt` | 200 with the spec's copy, every field non-empty | integration | yes (integration, slice 1) |
| ABOUT-P-03 | English text on the German head is refused. | the built `/de/about` | the English intro is put in | ABOUT-09 goes red | break in the build | yes (break in the build, slice 1) |

## 3. The route (as prerendered)

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| ABOUT-12 | Beside the story, the route lists the four stops, each a link to its chapter. | the built `/de/about` | the story's `<nav>` is read | a `<nav aria-label="Der Weg">`, distinct from the main menu, holding an `<ol>` of four links in order: Piri → `#piri`, Estremoz → `#estremoz`, Lissabon → `#lisbon`, Berlin → `#berlin`; each link at least 44 px tall (ABOUT-38) | build and unit | yes (build and unit, slice 1); the 44 px in the browser comes with slice 2 |
| ABOUT-13 | The head's route and the `<nav>`'s stops are the same places in the same order. | the built pages in en, de, pt | the eyebrow and the stops are read | the eyebrow equals the four stops' places joined by " → " | build | yes (build, slice 1) |
| ABOUT-14 | A fresh database gives the route in every language, the stops' ids the same in each. | an empty MySQL with Flyway and the `seed` profile | `GET /api/content/about/route?lang=en`, `de`, `pt` | 200; four stops with ids `piri`, `estremoz`, `lisbon`, `berlin` in that order in each language; every label and place non-empty | integration | yes (integration, slice 1) |
| ABOUT-P-04 | A fifth stop, a missing stop or another order is refused. | the stored route | Lisbon is put before Estremoz, or a stop is added | ABOUT-14 goes red; on the built page ABOUT-12 goes red | break in the seed, and in the build | yes (break in the seed and in the build, slice 1) |

## 4. Chapters

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| ABOUT-15 | The story has four chapters in route order, each headed by its place, number and years. | the built `/en/about` | the sections after the head are read | four `<section>`s, ids `piri`, `estremoz`, `lisbon`, `berlin`, each `aria-labelledby` its `<h2>` (the place in the page's language); the label reads `route.chapterOf` with n and 4, then " · " and the chapter's stored `years` | build and unit | in part (build and unit, slice 1): without years, which come with slice 3 (D11) |
| ABOUT-16 | Each chapter shows the text stored for it, in its language, in order, as written. | the about content in en, de, pt | each chapter is read | its paragraphs equal the stored `paragraphs` of that chapter and language, in order, one `<p>` each, and nothing else in the prose | unit (given test content); build (each stored paragraph is on the built page in its language) | |
| ABOUT-17 | The first three chapters say why Zua moved on; Berlin does not. | the built `/de/about` | the chapters' ends are read | Piri, Estremoz and Lisbon end with "Warum ich weitergezogen bin" and their stored `onward`; Berlin has neither | build and unit | |
| ABOUT-18 | The stored text is shown as text, never as markup. | a paragraph holding `<b>x</b>` in the test content; the seed | the chapter renders; every about string in the seed is read | the page shows the characters `<b>x</b>` and has no `<b>` element from it; no stored about string holds `<` or `>` | unit; integration on the seed | |
| ABOUT-19 | No gap marker from the mock-up reaches a page. | the built pages in en, de, pt | `<main>` and the files the page loads are read | no `[[`, no "gap:", and no element with the class `gap`, `ph`, `ann` or `mocknote` | build | yes (build, slice 1) |
| ABOUT-20 | Lisbon shows its three texts on a year axis, as published. | the built `/de/about` | Lisbon's `<figure>` is read | caption "Veröffentlicht in Lissabon"; an `<ol>` of three, 2007, 2009, 2010: ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications; Dynamic Interfaces; Modular Session Types for Distributed Object-Oriented Programming; kinds "Technischer Bericht", "Workshop-Paper", "Konferenz-Paper"; titles and venues `translate="no"`, titles `lang="en"` | build and unit | |
| ABOUT-21 | Lisbon's texts match the Writing page's, and Lisbon links there. | an empty MySQL with Flyway and the `seed` profile; the built page | `about/lisbon` and `writing/texts` are read in en, de, pt; Lisbon's link is read | years, titles, venues, co-authors and kinds of `congu2007`, `fool2009`, `popl2010` are equal in the two (D4); one link to `/de/writing` on `/de/about`, same tab | integration (a drifted title goes red) and build | |
| ABOUT-22 | Berlin tells four threads, in order, with their links. | the built `/en/about` | Berlin's threads are read | four `<section>`s with `<h3>`s, ids `software`, `education`, `research`, `running`, in that order; kickers `software`, `research`, `running` `translate="no"` and identical on the three pages, `education`'s kicker "a turn" ("eine Wende", "uma viragem"); software lists Embassy of Angola in Berlin, Casa Azul website, Kita Dienstplan (names `translate="no"`) and links to `/en/software`; research links to `/en/research`; both same tab | build and unit | |
| ABOUT-23 | The home page's `running` link has a place to land on. | the built pages in en, de, pt | `#running` is looked up | exactly one element with `id="running"`, the running thread inside `#berlin`, headed by its `<h3>` (HOME-HERO-09's target) | build | |
| ABOUT-24 | The two finished races show their times; distance and date read in the page's language. | the built pages | the running thread's races are read | in order: Silvesterlauf Berlin, 48:32, 10 km, "31 December 2025" / "31. Dezember 2025" / "31 de dezembro de 2025"; Berliner Halbmarathon, 1:52:15, "21.1 km" / "21,1 km" / "21,1 km", "6 April 2025" / "6. April 2025" / "6 de abril de 2025"; names and times identical on the three pages | build | |
| ABOUT-25 | The Strava link opens in a new tab, and says so. | the built `/de/about` | the running thread's link is read | "Auf Strava folgen" → `https://www.strava.com/athletes/zuacaldeira`, `target="_blank"`, `rel="noopener noreferrer"`, the `↗` `aria-hidden="true"`, a visually hidden " (öffnet in einem neuen Tab)" | build and unit | |
| ABOUT-26 | No CV link on the page until the file exists. | the built pages | `<main>` is read | no link to a CV and no "CV" or "Lebenslauf" link text (AB-D7; the footer's is the shell's) | build | |
| ABOUT-27 | When the site asks for a chapter, it gets it exactly as stored. | `about/berlin` stored for pt | `GET /api/content/about/berlin?lang=pt` | 200 with the stored JSON as it is (D1's shape) | integration | |
| ABOUT-28 | A fresh database gives every chapter in every language, complete and consistent. | an empty MySQL with Flyway and the `seed` profile | `about/piri`, `estremoz`, `lisbon`, `berlin` are read in en, de, pt | 200; every paragraph non-empty; in each chapter, the same number of paragraphs in the three languages; years, thread ids, names of things made, race names and times, link targets and the Strava `href` identical in the three | integration | |
| ABOUT-P-05 | A gap marker stored in the text stops the build. | `about/estremoz` for de holds "[[gap: school]]" | the snapshot is taken | it fails, naming page `about`, section `estremoz` and `de`; nothing is built | the snapshot script's test | yes (the snapshot script's test, slice 1) |
| ABOUT-P-06 | A mock-up marker put into the built page is refused. | the built `/en/about` | an element with the class `gap` is put in `<main>` | ABOUT-19 goes red | break in the build | |
| ABOUT-P-07 | A chapter missing a paragraph in one language is refused. | the seed | one of Lisbon's pt paragraphs is removed | ABOUT-28 goes red, naming the chapter and `pt` | break in the seed | |
| ABOUT-P-08 | A race time or name that differs between languages is refused. | the built `/de/about` | 48:32 is changed to 48:23 | ABOUT-24 goes red | break in the build | |
| ABOUT-P-09 | An outside link that does not say it opens a new tab is refused. | the built `/pt/about` | the hidden words are taken out of the Strava link | ABOUT-25 goes red | break in the build | |

## 5. In the browser (after the build, `npm run acceptance:browser`)

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| ABOUT-29 | On a laptop, the route stands beside the chapters and stays in view while reading. | `/en/about` at 1280 | the page is scrolled to Berlin | the `<nav>` is left of the chapters' `<h2>`s; its top stays at 88 px while Lisbon and Berlin pass | browser | |
| ABOUT-30 | On a phone, the route is a bar under the header and stays while reading. | `/de/about` at 390 | the page is scrolled to Lisbon | the bar's top equals the header's bottom (56 px), its four stops are all inside 390 px, and it stays there while scrolling | browser | |
| ABOUT-31 | The route marks the chapter you are reading, and fills up to it. | `/en/about` at 1280 and at 390 (where the content scrolls inside the sidenav container) | Lisbon's top is scrolled to a quarter of the viewport | the Lisbon link has `aria-current="true"` and no other link has it; Berlin's lozenge is `off`, the others are not; the fill reaches Lisbon's stop and not Berlin's | browser, at both widths | |
| ABOUT-32 | Before the first chapter, nothing is marked. | the same | the page is at the top | no link has `aria-current`; the fill is 0 | browser | |
| ABOUT-33 | Following a stop leads to its chapter, with the heading in view. | `/de/about` at 390 and 1280 | the "Lissabon" stop is followed (tap, or Tab then Enter) | the URL ends in `#lisbon`; Lisbon's `<h2>` is in view below the header (and the bar on the phone); Lisbon is then marked | browser | |
| ABOUT-34 | With reduced motion, the marker still marks, but nothing animates. | `/en/about` at 1280 with `prefers-reduced-motion: reduce` | Lisbon is scrolled into reading position, then the Berlin stop is followed | Lisbon is marked as in ABOUT-31; the lozenge's transition takes 0.01 ms or less; the jump to Berlin is immediate (`scroll-behavior: auto`) | browser | |
| ABOUT-35 | Without JavaScript, the page is complete and the route is four plain links. | the built `/en/about`, its scripts not run | the page is shown in Chromium with JavaScript off | four chapters with their text; no link `aria-current`, no lozenge `off`, the stops' text in `--zc-text-body`; the fill 0 | browser with JavaScript off, and build (no `aria-current` in the prerendered `<nav>`) | |
| ABOUT-36 | The marker's listeners end with the page. | the page in the unit test | the component is destroyed, then a scroll event is sent | no update runs (the listeners are removed) | unit | |
| ABOUT-37 | The page fits a phone: nothing runs off the side. | a phone at 390 px, `/en/about`, `/de/about`, `/pt/about` | the page is measured, at the top and scrolled to Berlin | no horizontal scroll; no element in `<main>` ends right of 390 px | browser | |
| ABOUT-38 | Every link is easy to tap, the route's stops included. | the same | the links in `<main>` are measured | each at least 44 px tall | browser | |
| ABOUT-39 | Keyboard users get to the content first. | `/de/about`, 390 and 1280 px | Tab, then Enter | the skip link goes to `<main>` on the same page (SHELL-10 on the new page) | browser | |
| ABOUT-40 | The page's text and the route's marks are easy to see in light and dark. | `/en/about` and `/de/about` at 1280, light and dark | the texts in `<main>` and the route's lozenges and fill are measured | every text 4.5:1 or more (the mock-up's lowest: 4.91 light, the ochre chapter label; 5.36 dark); lozenge borders and the fill 3:1 or more against their ground | browser, with the shared contrast reader | |
| ABOUT-41 | The page is read in light and dark without fixed colours. | the same | the story's colours are measured | the chapters' ground is `--zc-bg-warm`, the race cards `--zc-bg-white`, the threads' rules `--zc-azul`, `--zc-ochre`, `--zc-azul-deep`, `--zc-edge` | browser | |
| ABOUT-P-10 | A marker that marks two chapters, or marks one before the first chapter, is refused. | the page in the unit test with a fake layout | two chapters are reported at the line, or none | exactly the last of them is current; none when none (ABOUT-31, 32 in a unit test) | unit | |

## Diagram: the build (all slices)

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in the backend tests
        participant DB as MySQL 8 (seed R__about.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant P as dist/…/l/about/index.html
    actor V as Visitor (Chromium)
    T->>API: GET about/{head, route, piri, estremoz, lisbon, berlin} ?lang=l; writing/texts
    F->>API: the same, for l in en, de, pt
    API-->>F: 200, or 404 → the build stops (ABOUT-05); a [[gap]] → the build stops (ABOUT-P-05)
    F->>NG: about.json (@page-content/about)
    NG->>P: route /l/about: lang, title, PageHead, the route nav, four chapters
    T->>P: build tests: ABOUT-01 to 28
    V->>P: scroll, follow a stop, reduced motion, no JavaScript
    P-->>V: the route marks the chapter (aria-current), the fill follows
    T->>V: ABOUT-29 to 41
```

Session type (the visitor's path), in the convention of `shell.md`:

```
G = Build → API : get(about, s, l) .                 (s in head, route, piri, estremoz, lisbon, berlin)
    API → Build : { ok200(s_l) .
                    Build → Page : prerender(head_l, route_l, chapters_l) .
                    Page → Visitor : page(lang l, h1, nav[piri, estremoz, lisbon, berlin],
                                          chapters[piri, estremoz, lisbon(print), berlin(threads, running)]) .
                    μX . Visitor → Page : { read(c) . Page → Visitor : mark(c) . X ,
                                            jump(c) . Page → Visitor : mark(c) . X ,
                                            writing(l) . end , software(l) . end , research(l) . end ,
                                            out(strava, newTab_l) . end ,
                                            leave . end } ,
                    missing404 . Build → CI : fail(about, s, l) . end ,
                    gapMarker  . Build → CI : fail(about, s, l) . end }
  stop ids, years, titles, names, times, targets: the same for every l;  c in piri, estremoz, lisbon, berlin

Visitor ↾ = Page?page(…) . μX . Page!{ read . Page?mark . X , jump . Page?mark . X , writing . end ,
                                       software . end , research . end , out . end , leave . end }
Page ↾    = Build?prerender . Visitor!page(…) . μX . Visitor?{ read . Visitor!mark . X , jump . Visitor!mark . X ,
                                                               writing . end , software . end , research . end ,
                                                               out . end , leave . end }
```

`mark(c)` is client-side state only. Before the first `read`, nothing is marked (ABOUT-32). Without
a script, `read` and `jump` still move the reader, but `mark` is never sent (ABOUT-35).

| Arrow | Step in G | Cases |
|---|---|---|
| 1, 2 tests/F → API | `get`, `{ok200, missing404, gapMarker}` | ABOUT-05, 10, 11, 14, 21, 27, 28, P-04, P-05, P-07 |
| 4 NG → P | `prerender(…)` | ABOUT-01 to 04, 06, 07, 08, 09, 12, 13, 15 to 20, 22 to 26 |
| 5, 6 the visitor reads and jumps | `read(c)`, `jump(c)`, `mark(c)` in the loop | ABOUT-29 to 36, P-10 |
| the visitor's ways out | `writing`, `software`, `research`, `out(strava)` | ABOUT-21, 22, 25 |
| in Chromium, every width | `page(…)` on a phone, by keyboard, in light and dark | ABOUT-37 to 41 |
| forbidden: `head_en` on `l = de` | `ok200(s_l)` | ABOUT-P-03 |
| forbidden: a gap marker in `page(…)` | `gapMarker` ends in `fail` | ABOUT-19, P-05, P-06 |
| forbidden: two marks, or a mark before reading | `mark(c)` only after `read(c)` or `jump(c)`, one `c` | ABOUT-P-10 |
| forbidden: a name or time changed for `l` | the same for every `l` | ABOUT-P-08 |
| forbidden: `out` without saying so | `out(strava, newTab_l)` | ABOUT-P-09 |
| forbidden: the old page | `page(…)` holds only the new parts | ABOUT-P-02 |

The page is read-only: no repeat, stale-token or race rows. The loop only changes what is marked.

## Slices (agreed 2026-11-15)

`next` is not merged into `main` until the whole site is built (Zua, 2026-11-15; this page's last
slice is one part of that). The route, menu link and sitemap entry exist already, so each slice is
visible on the preview once pushed.

1. **Frame, head and the route, before the facts:**
   - the route becomes `loadChildren` with `about.routes.ts` providing `ABOUT_CONTENT`;
   - `about/head` and `about/route` go through the content pipeline;
   - `PageHead`, the route `<nav>` as prerendered, and the four chapters with their headings only
     (place and number; no years and no text yet);
   - the old page's markup, spec and i18n block go;
   - the gap guard in the snapshot script.

   Cases: ABOUT-01 to 14, 19, P-01 to P-05; ABOUT-15 without years.
2. **The reading marker, in the browser:** the column and the bar, the marker and fill, reduced
   motion, no JavaScript, the listeners' cleanup. One browser file. With slice 1's headings it can
   be checked before the text exists. Cases: ABOUT-29 to 36, P-10; ABOUT-38 for the stops.
3. **The story, once Zua's facts are in** (D2): the chapters' text in en, de and pt (the seed
   `R__about.sql`):
   - Lisbon's texts and their equality with Writing's;
   - Berlin's threads, `#running`, the races and Strava;
   - no CV link.

   Cases: ABOUT-15 (years), 16 to 18, 20 to 28, P-06 to P-09. If Zua's text arrives one chapter at
   a time, this slice may be cut per chapter (D1 allows it).
4. **The whole page, in the browser:** phone, keyboard, contrast and colours, in en, de and pt.
   Cases: ABOUT-37 to 41. Then the design review on the preview against the spec.

## Slice 1: frame, head and the route

The markup this slice builds, after the shared head: one `div.about-story` holding the route
`<nav class="about-route" aria-label="{route.label}">` (a visible label, then an `<ol>` of four
`<a href="/l/about#{id}">`, each with a lozenge, "Chapter n" and the place) and the four chapters,
each `<section id="{id}" aria-labelledby="h-{id}">` with its number (`aria-hidden`), its label
`route.chapterOf` with n and 4, and `<h2 id="h-{id}">` the place. No years, paragraphs or onward
text: those are Zua's (slice 3, D2). The places and labels come from `about/route`, so the headings
need no fact that is not agreed. Static only: the marker, the fill, `off` and the phone bar's
stickiness are slice 2's.

Test list (crossed off in the "Done" note below as each is committed):
- **Acceptance, the outer tests** (new `acceptance/about.test.mjs`), declared first and red on
  today's build of the old page:
  - A1 ABOUT-09, the German page opens with "Piri → Estremoz → Lissabon → Berlin", one `<h1>` "Über
    mich" and the German intro.
  - A2 ABOUT-07, the old page is gone from `<main>` in en, de, pt: no `app-section-header`, no old
    heading, no `<strong>`.
- **Backend** (Testcontainers, one class per run):
  - B1 ABOUT-11, the seed answers the agreed head in en, de, pt, none empty (new
    `AboutSeedIntegrationTest`, new seed `R__about.sql`).
  - B2 ABOUT-14, the seed answers the route in en, de, pt: four stops `piri`, `estremoz`, `lisbon`,
    `berlin` in that order in each, every label and place non-empty, and the spec's English labels.
  - B3 ABOUT-10, the stored German head as it is (`ContentSectionIntegrationTest`). The table is
    page-agnostic, so B3 is expected green at once; it is shown to bite by a break in the service.
- **Script** (`fetch-content.test.mjs`):
  - S1 ABOUT-05, `about/head` missing in `de` stops the snapshot, naming page, section, language.
  - S2 ABOUT-P-05, a gap marker in any stored string stops the snapshot, naming page, section and
    language (D9).
- **Unit** (`pages/about/about.spec.ts`, the old spec replaced):
  - U1 ABOUT-09, the page shows `PageHead` with the head from `ABOUT_CONTENT` on a German page.
  - U2 ABOUT-02, the title `Alexandre Zua Caldeira — ${heading}`.
  - U3 ABOUT-01 and ABOUT-06, `/de/about` brings its own text with its route (`about.routes.ts`,
    `loadChildren`), in German.
  - U4 ABOUT-12, the route: a `<nav>` named `route.label`, an `<ol>` of four links in stop order to
    `/de/about#piri` … `#berlin` (D8), each reading "Chapter n" and the place.
  - U5 ABOUT-15 without years, the chapters: four `<section>`s with the stops' ids, each
    `aria-labelledby` its `<h2>` (the place); the label `route.chapterOf` with n and 4; the number
    `aria-hidden`; nothing else in a chapter yet.
- **Cleanup (as D7, D12 in `research.md`):** the old page's template, styles and spec, and the
  `about` block of `Translations` in `en`, `de`, `pt`; the compiler and the suite hold it. The About
  half of LA-04, 05, 12 to 16 and 22 in `docs/language.md` is marked fixed by the rebuild.
- **Acceptance, after the build:** A3 ABOUT-01 (three pages, their `lang`, each with
  `app-page-head`), A4 ABOUT-02, A5 ABOUT-03, A6 ABOUT-04, A7 ABOUT-08 (en, exactly one `<h1>`) and
  ABOUT-09 for pt, A8 ABOUT-06 (own text loaded; not the home hero's sentence, the Software lead's
  title, the Writing or the Research intro; the About intro in no other page's files), A9 ABOUT-12
  on the built `/de/about`, A10 ABOUT-13 (the eyebrow equals the stops joined by " → ", en, de,
  pt), A11 ABOUT-15 on the built pages (no years), A12 ABOUT-19 (no `[[`, no "gap:", no element
  with the class `gap`, `ph`, `ann` or `mocknote` in `<main>` or the files the page loads).
- **Protocol rows,** each that is green at first shown red by its break, then restored (md5
  checked): ABOUT-P-01 (`pt/about` moved out of the build: A3), ABOUT-P-02 ("Berlin Chapter" put in
  `<main>` of the built `/en/about`: A2), ABOUT-P-03 (the English intro on the built `/de/about`:
  A1), ABOUT-P-04 (Lisbon before Estremoz in the seed: B2; and in the built `/de/about`: A9),
  ABOUT-P-05 (S2).

Not in slice 1: the years, paragraphs, onward texts, Lisbon's texts, Berlin's threads and
`#running` (slice 3); the marker, the fill, the bar and every browser check (slices 2 and 4). The
route, menu link, current marker, sitemap entries and nginx exist already.

```mermaid
sequenceDiagram
    autonumber
    actor T as Tests
    box Real: compose.build.yml, Testcontainers in B1–B3
        participant DB as MySQL 8 (Flyway + seed R__about.sql)
        participant API as Content API
    end
    participant F as fetch-content.mjs
    participant NG as ng build (prerender)
    participant P as dist/…/l/about/index.html
    T->>API: B1–B3: GET about/{head, route}?lang=l
    API->>DB: select body where page=about, section=s, lang=l
    F->>API: GET about/{head, route}?lang=l, for l in en, de, pt
    API-->>F: 200 {…}; 404 → the build stops (S1); a [[gap: …]] in any string → it stops (S2)
    F->>NG: about.json (@page-content/about)
    NG->>P: route /l/about (U3): lang, alternates, title (U2), PageHead (U1), route nav (U4), four chapter heads (U5)
    T->>P: A1–A12, P rows
```

Session type. Convention: a role that a branch never calls just ends there. `s` in `head`,
`route`; `c` in `piri`, `estremoz`, `lisbon`, `berlin`, in that order.

```
G = Build → API : get(about, s, l) .
    API → Build : { ok200(s_l) .
                    Build → Page : prerender(l, title_l, alternates, current(about), head_l, route_l) .
                    Page → Visitor : page(lang = l, h1, nav(label_l, [c ↦ /l/about#c]), chapters[c: n, of 4, place_l]) .
                    Visitor → Page : { jump(c) . end , leave . end } ,
                    missing404 . Build → CI : fail(about, s, l) . end ,
                    gapMarker  . Build → CI : fail(about, s, l) . end }

Build ↾   = API!get . API?{ ok200 . Page!prerender . end , missing404 . CI!fail . end , gapMarker . CI!fail . end }
API ↾     = Build?get . Build!{ ok200 . end , missing404 . end , gapMarker . end }
Page ↾    = Build?prerender . Visitor!page(…) . Visitor?{ jump . end , leave . end }
Visitor ↾ = Page?page(…) . Page!{ jump . end , leave . end }
```

`gapMarker` is the API's `200` whose body holds `[[`: the API does not know it; the snapshot does.
`jump(c)` here is the plain link to the chapter; the marker that answers it (`mark(c)`) is slice 2's.

| Arrow | Step in G | Rows |
|---|---|---|
| 1–2 tests → API → DB | `get`, `ok200(s_l)` | B1, B2, B3 (ABOUT-10, 11, 14) |
| 3–4 F → API | `get` × 6, `{ok200, missing404, gapMarker}` | S1, S2 (ABOUT-05, P-05) |
| 5–6 F → NG → P | `prerender(l, title_l, alternates, current(about), head_l, route_l)` | U1–U5 |
| 7 T → P | `page(lang = l, h1, nav(…), chapters[…])` | A1, A3–A12 |
| `jump(c)` | the stop's link `/l/about#c` to `section#c` | U4, U5, A9, A11 |
| forbidden: a page missing for some `l` | `prerender` for every `l` | ABOUT-P-01 (A3) |
| forbidden: the old page in `page(…)` | `page` holds the new parts only | ABOUT-P-02 (A2) |
| forbidden: `head_en` on `l = de` | `ok200(head_l)` | ABOUT-P-03 (A1) |
| forbidden: stops in another order, or not four | `nav([c …])` in route order | ABOUT-P-04 (B2, A9) |
| forbidden: unfinished text reaches `prerender` | `gapMarker` ends in `fail` | ABOUT-P-05 (S2), A12 |

The build is read-only: no repeat, stale-token or race rows. The old page is not a refactor: what
the visitor sees changes, so there is no `G_pre`/`G_post` claim; A2 and ABOUT-P-02 hold the change.

**Done 2026-11-15** (`fb67a02` to `99e993a`). Red first, each for its own reason: A1 on the old
build, eyebrow and intro `[]`; A2 on the old build, `app-section-header`, the three old headings and
`<strong>` in en, de and pt; S1 and S2 "Missing expected rejection"; U1 eyebrow `[]` and the old
`<h1>`; U2 title `''`; U3 `NG0201 No provider found for ABOUT_CONTENT`; U4 `[]`; U5 `[]` (a first
red came from the test's own selector, which caught the shared head's `<section>`); B1 and B2
`expected: 200 but was: 404` in en, de and pt; A3, A4, A7, A8, A9, A10 and A11 on the old build. A10
first passed on the old build with both sides empty; it now asks for four stops. A9 was red once on
the new build from a bug in the test (it read the outer span); fixed in the test. Green at first and
shown to bite, each break restored (md5 checked): B3 (the service answering the English row for every
language), A5 (the `pt` alternate to `/pt/home`), A6 (Forschung marked current too), A8 (the home
hero's sentence in the About chunk), A12 (a `span.gap` in `<main>`). Protocol rows: ABOUT-P-01
(`pt/about` moved out: A3 red), P-02 ("Berlin Chapter" in en's `<main>`: A2 red), P-03 (the English
intro on de: A1 red), P-04 (Lisbon before Estremoz in the seed: B2 red; in the built nav: A9 red),
P-05 (S2). The cleanup was held by the compiler and the suite.

Results: unit 278 passed, 5 skipped (47 files; one whole-suite run failed at random under load, its
output cut off before the test's name, and the rerun was green); scripts 19/19; `acceptance`
138/138; backend `AboutSeedIntegrationTest` 6 and `ContentSectionIntegrationTest` 10, one class pair
per run (not `./mvnw verify` whole: the machine was shared); the build prerenders 26 routes. Looked
at in Chromium (not a test): no horizontal scroll at 390 (de) or 1280 (en), the route's links 55 and
44 px tall. Not run: the browser tests (slice 2 adds the first for this page) and
`acceptance:nginx` (no server change).

Leftovers, not built:
- **For Zua's review on the preview** (D7): the drafted intro and the route's labels in en, de, pt.
- **The title line** (`Alexandre Zua Caldeira — ${heading}`) is now in Writing, Research and About;
  one helper for the three is worth it (Research's leftover said so at the third).
- **The initial bundle** is 508.50 kB (514.71 before; 500 kB budget): the old About text left it.
- **`docs/tdd.md`** still says `next` is merged page by page (as `logo.md` noted).

## Decisions

**Answered by Zua on 2026-11-15: all seven as recommended**, the first option of each. So:
- **D1: a.** One section per chapter.
- **D2: a.** Slices 1 and 2 now; slice 3 once the facts are in.
- **D3: a.** Zua writes; ui-design-peer drafts the other two languages; Zua reads both before the
  merge.
- **D4: a.** A copy of Lisbon's texts, held equal to Writing's.
- **D5: a.** Dates and distances stored per language.
- **D6: a.** No Berlin Marathon until Zua gives a time.
- **D7: a.** The intro and labels built as drafted, reviewed on the preview.

Zua's answers, repeated when the build began (2026-11-15):
- The cases, the four slices and D1 to D7 as recommended: D1 one section per chapter; D2 slices 1
  and 2 built now, the story (slice 3) only once Zua's text for it is in, nothing unfinished stored;
  D3 Zua writes the story, the designer drafts de and pt, Zua reads both before `next` is merged; D4
  Lisbon's texts a copy held equal to Writing's by a test; D5 the races' dates and distances as text
  per language; D6 the Berlin Marathon not shown until Zua gives a time; D7 the head's intro and
  labels built as drafted, reviewed by Zua on the preview.
- **Merging:** `next` goes into `main` only when the whole site is built (as in `logo.md`).

Taken while planning slice 1 (2026-11-15, tdd-peer; Zua may change them):
- **D8. The stops link to `/l/about#{id}`,** the page's path with the fragment, as the skip link
  does (SHELL-10). The site's `<base href="/">` makes a bare `#piri` lead to `/#piri`, the home
  page. The fragment is ABOUT-12's `#piri`.
- **D9. The gap guard is the snapshot's, for every page:** any string in any section holding `[[`
  stops the snapshot with "Unfinished text (a gap marker) in page p, section s, language l". The
  API stores what it is given; the build refuses it (ABOUT-P-05).
- **D10. `about/route` is stored whole in slice 1,** with the spec's labels (`movedOn`, `newTab`
  included, D7's drafts): they are labels, not facts about Zua. Slice 1 shows `label`, `chapter`,
  `chapterOf` and the stops' places.
- **D11. The chapters' heads in slice 1** take the place from `route.stops` and the label from
  `route.chapterOf` alone ("Chapter 1 of 4"). The " · years" joins with the chapter's section in
  slice 3; until then there is no `about/piri` and the rest, and the snapshot does not ask for them.

The options as they were proposed:
- **D1. The stored shape.**
  - (a) One section per chapter (`about/piri`, `estremoz`, `lisbon`, `berlin`), plus `head` and
    `route`, as in the spec. Each chapter can be written, seeded and built on its own. **Recommended.**
  - (b) One `about/story` section with all four chapters: fewer rows, but one object to edit for
    every change.
- **D2. Zua's facts and the build.**
  - (a) Slices 1 and 2 are built now, without the facts. The chapters' text (slice 3) is built once
    Zua's text for it is in, and nothing unfinished is stored. **Recommended.**
  - (b) Wait for all facts before any slice.
  - (c) Store the drafted text with `[[gap]]` markers now. Rejected by ABOUT-P-05 itself: every
    build would stop.
- **D3. The story in German and Portuguese.**
  - (a) Zua writes in English (or any language). ui-design-peer drafts the other two following
    `docs/language.md` ("du", pt-PT). Zua reads both on the preview before `next` is merged.
    **Recommended**, because it is Zua's own life, in words that must sound like Zua.
  - (b) As the other pages: drafted, built, reviewed later.
  - (c) Zua writes all three.
- **D4. Lisbon's three texts.**
  - (a) A copy in `about/lisbon`, held equal to `writing/texts` by an integration test (ABOUT-21,
    as RS-TOOL-03). **Recommended**, so the page downloads only its own text.
  - (b) Move the texts to `shared` and read them from both pages.
  - (c) No list, only the link to Writing.
- **D5. The races' dates and distances.**
  - (a) Stored per language as text, as in the copy table. **Recommended**, as the site's other
    labels.
  - (b) Stored once (ISO date, number) and formatted in the page by locale. This needs Angular's de
    and pt locale data, which the site does not load today.
- **D6. The Berlin Marathon** (the old page's "From the Silvesterlauf to the Berlin Marathon"; the
  race list has it on 27 September 2026, still marked upcoming).
  - (a) Not shown, until Zua gives a time. **Recommended.**
  - (b) Named in the running text without a time.
- **D7. The head's intro and the labels drafted here** ("My CV, told as a story …", "eine Wende",
  "Veröffentlicht in Lissabon", …).
  - (a) Built as drafted; Zua reviews them on the preview with the story. **Recommended.**
  - (b) Zua rewrites them first.

Settled already (`about-notes.md`): AB-D1 to AB-D10 (the route as order and table of contents,
pedagogy in Berlin, facts from Zua only, running with the two races and Strava, the Embassy stays,
no photo, the CV later, no short option, option B).
