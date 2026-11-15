# Build spec: About page

Chosen on 2026-11-15: **option B, the route beside the chapters** (AB-D10 in `about-notes.md`).
Visual reference: `about.html` beside this file (`#opt=b`), or `index.html` to compare. Screenshots
are in `~/.cache/zc-scratch/about-mock/shots/` (not in the repo): `opt-b-en-{390,1280}-light.png`,
`opt-b-en-390-dark.png`, `motion-b-{390,1280}-reading-lisbon.png`. Option A stays in the mock-up for
comparison and is not built. Mock-ups are not production code: do not copy their markup. The
behaviour is in `docs/examples/about.md`, built test-first.

The mock-up's text is a first draft with marked gaps (Gap, Confirm, Draft). **The story's text is
content:** Zua writes the facts in Zua's own words, and the seed holds only finished text. No gap
marker ever reaches a built page (ABOUT-19, ABOUT-P-05).

## Purpose
In Zua's words (2026-11-15): "this section will tell my CV in prose, what I've done as a Person not
only as software engineer." About is Zua's CV told as a story, along the route Piri → Estremoz →
Lisbon → Berlin. There is one chapter per stop: where Zua was, what Zua learned or did there, and
why Zua moved on. The home page makes the claim in one sentence; About tells the life behind it.
Readers, from `docs/design.md`:
- **Hiring managers and recruiters** (phone or laptop): the path, the work, the training, and later
  the CV.
- **Researchers:** where the background comes from (Lisbon, the 2007 to 2010 texts, ICE 2026).
- **Teams building AI agents:** whom they would work with.

The menu's About link (SHELL-11) and the home hero's first button lead here. The home lattice's
`running` atom will lead to `#running` (HOME-HERO-09).

## Sections, in order
1. **Head:** the shared `PageHead` (`common/page-head/`), as on Software, Writing and Research:
   - eyebrow: the route, the four places joined by " → ";
   - `<h1>`: About / Über mich / Sobre;
   - one intro sentence.
2. **The story:** a two-column block, with the route (`<nav>`) beside the four chapters:
   1. **Piri**
   2. **Estremoz**
   3. **Lisbon:** with the three texts from Lisbon on a year axis, and a link to Writing.
   4. **Berlin:** four threads, *software*, *a turn* (the Erzieher training), *research* and
      *running* (`id="running"`), with the two races and the Strava link.
3. **Footer:** the shared footer (SHELL-07), unchanged.

The header is the shared one; its About link is current (`aria-current="page"`, D34 in
`software.md`). There is no theorem band. No CV link in `<main>` until the CV file exists (AB-D7);
the footer's CV link is the shell's.

## Layout per width
One column of 1200 px with a 24 px gutter (16 px under `Handset`), as on the other pages.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Head | Eyebrow, `<h1>`, intro, stacked | The same | The same, intro up to 40 rem |
| Story | One column; the route is a **bar** under the header | The same (the bar up to 900 px) | Two columns: route `13.5rem`, chapters `1fr`, gap `clamp(32px, 5vw, 72px)`; the route is a **column** |
| Chapter head | Number, then "Chapter n of 4 · years" above the place | The same | The same, larger |
| Lisbon's texts | One column on a vertical axis | One column | Three columns on a horizontal axis |
| Berlin's threads | One column | One column | One column (the text column is narrower beside the route) |
| Races | One column | Two columns | Two columns |
| "Why I moved on" | Label above the text | Label above the text | Label `9rem` left, text right |

The switch from bar to column is at 900 px. Running text stays near 65 characters (`.prose`).
Measured in the mock-up, with its gap boxes: page height 5,346 px at 390 and 4,337 px at 1280 (en).
The real heights follow Zua's text.

## The route, in its two forms
One `<nav>` holding an `<ol>` of four links, in route order, each to its chapter (`#piri`,
`#estremoz`, `#lisbon`, `#berlin`). Each link shows a lozenge and the place name, and on the
laptop column also "Chapter n" above the name. The `<nav>` is labelled `route.label` ("The route").

- **Lozenge:** the Losango's node, 22 px, rotated 45°, 3 px border. Its fill tells where the stop is
  on the route:
  - **Piri:** open (`--zc-bg-warm` inside a `--zc-azul` border), where the route starts.
  - **Estremoz and Lisbon:** `--zc-azul`.
  - **Berlin:** `--zc-ochre`, where Zua is now.
  - **Off:** a stop not yet reached while reading gets the class `off`: `--zc-bg-warm` fill with a
    `--zc-edge` border.
- **Track and fill:** a 3 px track in `--zc-edge` at 45 % opacity runs through the stops. Over it,
  a fill in `--zc-azul` runs from the first stop to the reading position: `--p` from 0 to 1, set by
  the script.
- **Laptop column (≥ 900 px):** `position: sticky; top: 88px` (the 64 px header plus 24 px). The
  ochre-text label "The route" sits above the list. The list is vertical, 24 px between stops; the
  place is Fraunces 600, 1.25 rem; "Chapter n" is Plex Mono 0.7 rem. Each link is at least 44 px
  tall. The track and fill are vertical, `left: 10px`.
- **Phone bar (< 900 px):** `position: sticky; top: 56px` (right under the Handset header),
  `z-index` under the header's. It is full bleed (negative gutter margins), on `--zc-bg-warm` at
  92 % with a 10 px backdrop blur and a `--zc-border-light` bottom rule.
  - The label is visually hidden; "Chapter n" is not shown.
  - The four stops sit in one row, `space-between`: name above, lozenge below (16 px). The first
    stop is aligned left, the last right, the middle two centred.
  - The track and fill are horizontal, 21 px from the bottom.
  - Each link is at least 44 px tall (measured 44 or more in the mock-up). Nothing overflows at
    390 px, also in German ("Lissabon") and Portuguese ("Berlim").

## The reading marker and its motion
- **The current chapter** is the last of the four whose top is at or above 40 % of the viewport's
  height. Its link gets `aria-current="true"`, and no other link has it.
  - Before Piri's top reaches that line, no stop is current and `--p` is 0.
  - The current link shows its lozenge at `scale(1.25)` and its name in `--zc-text-heading`,
    underlined 2 px in `--zc-ochre`.
  - Stops after the current one are `off`. The others are muted (`--zc-text-muted`, hover
    `--zc-text-heading`).
- **The fill:** `--p = min(1, (current + share of the current chapter read) / 3)`, where the share is
  how far the 40 % line has moved through the chapter's height. The fill reaches a stop's lozenge
  when its chapter becomes current, and is full once Berlin is current.
- **Motion:**
  - The lozenge changes (scale, fill, border) with a 0.35 s ease transition.
  - The fill follows the scroll directly, updated once per frame (`requestAnimationFrame`) and not
    animated on its own.
  - A stop's link scrolls to its chapter. Smooth scrolling is the site's `html { scroll-behavior:
    smooth }`.
- **Reduced motion:** the marker still marks, because it is state, not decoration. The site's
  `prefers-reduced-motion` rule makes the lozenge's change instant and the jump to a chapter
  immediate. Nothing else moves on the page.
- **Without JavaScript (the prerendered page):** no link is current, no stop is `off`, and the four
  links read as plain links in `--zc-text-body`, with the fill at 0. The rule that mutes the links
  applies only once the script has run (a class set by it, as `html.motion` on Research). The page
  is complete.
- **Implementation notes:**
  - Browser only, in `afterNextRender`, outside Angular's zone, as the home hero's parallax.
  - On a phone the content scrolls inside the sidenav container, not the window (the comment in
    `pages/home/hero/hero.ts`), so listen for `scroll` on `document` in the capture phase and
    measure with `getBoundingClientRect()`, never `window.scrollY`.
  - Remove the listeners on destroy.
  - The anchors' targets get `scroll-margin-top`: 64 px plus a little on a laptop, 124 px on a
    phone (header and bar), so a chapter's heading is not hidden under them.

## Chapters
Each chapter is a `<section id="{stop}" aria-labelledby="h-{stop}">`, with a top rule in
`--zc-border-light` (none on the first). Its head has three parts:
- **Number:** Fraunces 400, `clamp(3rem, 6vw, 5rem)`, `--zc-azul`, and `--zc-ochre-text` for
  Berlin. It is `aria-hidden`, because the label says it.
- **Label:** `route.chapterOf` with n and 4, " · ", and the chapter's `years`; Plex Mono
  0.8125 rem, `--zc-ochre-text`.
- **Heading:** `<h2 id="h-{stop}">` with the place, Fraunces 600, `clamp(2rem, 4.4vw, 3.25rem)`.

Then the chapter's paragraphs in a `.prose` column, Archivo 1.0625 rem.

The first three chapters end with **"Why I moved on"** (`route.movedOn`), above a dashed `--zc-edge`
rule: the label in Plex Mono ochre text, then the chapter's `onward` text. Berlin has no onward
text.

- **Lisbon, "In print, from Lisbon":** a `<figure>` whose `<figcaption>` is the label, holding an
  `<ol>` of the three texts in year order (2007, 2009, 2010):
  - each item shows the year (Plex Mono 500, 1.25 rem), the kind (translated), the title (Fraunces
    600, `translate="no"`, `lang="en"` on de and pt) and "venue · with co-authors" (Plex Mono
    0.75 rem, muted, `translate="no"`);
  - each item has a 12 px `--zc-azul` lozenge on a 2 px `--zc-edge` axis, horizontal at 900 px and
    up, vertical below;
  - after the list, one link to the Writing page, `/l/writing`, same tab.
- **Berlin, four threads:** each thread is a `<section aria-labelledby>` with a 4 px left rule, in
  this order:

  | Thread | Kicker | Rule |
  |--------|--------|------|
  | software | `software`, never translated (an atom of `Zua = software ∥ research ∥ running`) | `--zc-azul` |
  | education | `a turn`, translated | `--zc-ochre` |
  | research | `research`, never translated | `--zc-azul-deep` |
  | running | `running`, never translated; the section has `id="running"` | `--zc-edge` |

  Each thread has a kicker (Plex Mono 0.8125 rem, muted), an `<h3>` (Fraunces 600, 1.5 rem) and its
  paragraphs. Then, depending on the thread:
  - **software:** a list of three things made, each name in `<b>` (`translate="no"`): Embassy of
    Angola in Berlin, Casa Azul website, Kita Dienstplan. Then a link to `/l/software`.
  - **research:** a link to `/l/research`.
  - **running:** the two races, then the Strava link.

  Internal links are same tab, built with `pagePath(lang, page)` (never a bare `/writing`, SHELL-04).
- **Races:** an `<ul>` of two cards on `--zc-bg-white`, each with a 1 px `--zc-border-light`
  border and a 3 px `--zc-ochre` top. Each card shows:
  - the time (Plex Mono 500, 1.6 rem, `--zc-text-heading`, never translated);
  - the race's name (600, `translate="no"`);
  - distance and date in the page's language (Plex Mono 0.75 rem, muted).
- **Strava:** "Follow on Strava" to `https://www.strava.com/athletes/zuacaldeira`, as every outside
  link on the site: `target="_blank"`, `rel="noopener noreferrer"`, a `↗` in Plex Mono with
  `aria-hidden="true"`, and a visually hidden " (opens in a new tab)" in the page's language
  (`.visually-hidden`, `styles.css`).

## Content
Page `about` in the content API (`content_section`, one JSON object per page, section and language,
D11 in `software.md`), through the build's snapshot as `@page-content/about`, provided by
`about.routes.ts` as `ABOUT_CONTENT` (D20, D21 in `software.md`). It is required in **en, de and
pt**; a missing language or section stops the build (as HOME-HERO-06). The shape below is D1 in
`docs/examples/about.md` (agreed 2026-11-15: one section per chapter, so Zua's text can arrive one chapter at
a time).

| Section | Fields |
|---------|--------|
| `head` | `eyebrow`, `heading`, `intro` (the `PageHead` shape) |
| `route` | `label`, `chapter` ("Chapter {n}"), `chapterOf` ("Chapter {n} of {total}"), `movedOn`, `newTab`, `stops`: four `{id, place}` in route order, ids `piri`, `estremoz`, `lisbon`, `berlin` |
| `piri`, `estremoz` | `years`, `paragraphs` (strings), `onward` |
| `lisbon` | `years`, `paragraphs`, `print`: `{label, texts: [{id, year, kind, title, venue, with}], link: {label, page: "writing"}}`, `after` (paragraphs after the texts), `onward` |
| `berlin` | `years`, `paragraphs`, `threads`: four `{id, kicker, heading, paragraphs, made?: [{name, text}], link?: {label, page}, races?: [{name, distance, date, time}], strava?: {label, href}}` with ids `software`, `education`, `research`, `running` |

Rules for the stored text:
- **Plain text only.** No HTML in any string: the old page's `<strong>` and `[innerHTML]` go, and the
  page binds text, never HTML (ABOUT-18).
- **No gap markers.** If a text must ever be stored before it is finished, it is written as
  `[[gap: …]]`, and the snapshot refuses it, naming page, section and language (ABOUT-P-05). The
  mock-up's classes (`gap`, `ph`, `ann`, `mocknote`) never appear in the app.
- **The same in every language:**
  - section ids, stop ids, thread ids, years;
  - the three texts' years, titles and venues;
  - names of things made, race names and times;
  - link targets and the Strava `href`.

  Translated: the places (Lisbon, Lissabon, Lisboa; Berlin, Berlin, Berlim), the labels, the
  paragraphs, kinds, distances and dates.
- **Lisbon's texts are a copy of Writing's** (`writing/texts`, the same ids `congu2007`,
  `fool2009`, `popl2010`), so the page downloads only its own text. An integration test holds the
  copy equal to Writing's: years, titles, venues, co-authors and kinds (D4).

### Copy: labels (en / de / pt)
The story's paragraphs, thread headings, years and onward texts are not here: they are Zua's, given
in a later turn, and become the seed. The de and pt story follows `docs/language.md` (D3).

| Key | en | de | pt |
|-----|----|----|----|
| `title` | Alexandre Zua Caldeira — About | Alexandre Zua Caldeira — Über mich | Alexandre Zua Caldeira — Sobre |
| `head.eyebrow` | Piri → Estremoz → Lisbon → Berlin | Piri → Estremoz → Lissabon → Berlin | Piri → Estremoz → Lisboa → Berlim |
| `head.heading` | About | Über mich | Sobre |
| `head.intro` (draft, D7) | My CV, told as a story: four places, what I learned and did in each, and why I moved on. | Mein Lebenslauf als Geschichte: vier Orte, was ich an jedem gelernt und getan habe, und warum ich weitergezogen bin. | O meu currículo contado como uma história: quatro lugares, o que aprendi e fiz em cada um, e porque segui em frente. |
| `route.label` | The route | Der Weg | O percurso |
| `route.chapter` | Chapter {n} | Kapitel {n} | Capítulo {n} |
| `route.chapterOf` | Chapter {n} of {total} | Kapitel {n} von {total} | Capítulo {n} de {total} |
| `route.movedOn` | Why I moved on | Warum ich weitergezogen bin | Porque segui em frente |
| `route.newTab` | opens in a new tab | öffnet in einem neuen Tab | abre num novo separador |
| `lisbon.print.label` | In print, from Lisbon | Veröffentlicht in Lissabon | Publicado em Lisboa |
| `lisbon.print.link.label` | All texts, with their links, on the Writing page | Alle Texte mit ihren Links auf der Seite Texte | Todos os textos, com as ligações, na página Textos |
| kinds | Technical report · Workshop paper · Conference paper | Technischer Bericht · Workshop-Paper · Konferenz-Paper | Relatório técnico · Artigo de workshop · Artigo de conferência |
| `education.kicker` | a turn | eine Wende | uma viragem |
| software link | More on the Software page | Mehr auf der Software-Seite | Mais na página Software |
| research link | The paper on the Research page | Das Paper auf der Forschungsseite | O artigo na página Investigação |
| `strava.label` | Follow on Strava | Auf Strava folgen | Seguir no Strava |
| race 1 | Silvesterlauf Berlin · 10 km · 31 December 2025 · 48:32 | Silvesterlauf Berlin · 10 km · 31. Dezember 2025 · 48:32 | Silvesterlauf Berlin · 10 km · 31 de dezembro de 2025 · 48:32 |
| race 2 | Berliner Halbmarathon · 21.1 km · 6 April 2025 · 1:52:15 | Berliner Halbmarathon · 21,1 km · 6. April 2025 · 1:52:15 | Berliner Halbmarathon · 21,1 km · 6 de abril de 2025 · 1:52:15 |

The head's eyebrow and heading come from today's `hero.location` and `about.title`. The Strava
label comes from `running.stravaButton`, and the kinds from `writing/texts`. The other de and pt
labels are drafts by ui-design-peer, for Zua's review on the preview. The races are from
`ContentService.races` [3] and [4] (AB-D4).

## What of the old page goes
- **Goes:**
  - `pages/about/about.html`, `about.css` and `about.spec.ts`, and its use of `SectionHeader`. The
    component itself stays, because Running, Contact and the hidden pages use it.
  - The `about` block in `en.ts`, `de.ts`, `pt.ts` (`title`, `subtitle`, `journeyHeading`,
    `journeyP1`, `journeyP2`, `berlinHeading`, `berlinP1`, `berlinP2`, `beyondHeading`,
    `beyondP1`), and its type in `Translations` (`models/i18n.ts`). The compiler and the suite hold
    the cleanup, as D7 and D12 in `research.md`.
  - With it, the About half of the language findings LA-04, 05, 12 to 16 and 22 in
    `docs/language.md`; mark them as fixed by the rebuild there.
- **Moves into the story,** as Zua confirms or rewrites it: what the old texts said (the studies,
  session types, "types as specifications …", the Erzieher training, Kita Casa Azul, the Embassy of
  Angola, Angular and Spring Boot, amateur running).
- **Stays:**
  - `hero.aboutCta` and `hero.location`, which the home hero still uses;
  - `ContentService.races` and `socialLinks`, which the Running page still uses;
  - the route path `about`, which becomes `loadChildren` with `about.routes.ts`, as Research;
  - the sitemap entries, nginx, the menu link and its current marker, which exist already.

## States
- **Long data:**
  - The longest place is "Lissabon" (de) in the phone bar, and it fits at 390.
  - The longest Lisbon title is ConGu's, at 76 characters: three lines at 390, two at 1280.
  - The chapters' real length is Zua's text; the rail does not depend on it.
- **German** runs longest; check 390 and 1280 in de.
- **No empty, loading or error state:** the page is prerendered from the snapshot. A missing
  language or section, or a gap marker, stops the build.
- **The CV link** comes at the end of `<main>` once the file exists (AB-D7, a later change).

## Accessibility
- **Headings:** one `<h1>`; an `<h2>` per chapter (the place), an `<h3>` per Berlin thread.
- **The route:** a `<nav>` with its own name ("The route", "Der Weg", "O percurso"), distinct from
  the main menu's. It is an ordered list, and the current stop has `aria-current="true"`. The current
  stop shows its state by size and by an underline, not by colour alone.
- **Anchors:** after following a stop's link, the chapter's heading is not hidden under the header
  or the bar.
- **Text that stays as it is:** titles, venues, names of things made and race names are
  `translate="no"`. On de and pt pages the English titles carry `lang="en"`. The atom kickers
  (`software`, `research`, `running`) are `translate="no"`.
- **Outside links** say in words that they open a new tab; the arrow is decorative.
- **Size and contrast:**
  - Every link is at least 44 px tall, the route's stops included.
  - Measured in option B of the mock-up: no horizontal scroll at 390, lowest text contrast 4.91:1
    in light (the ochre chapter label) and 5.36:1 in dark.
  - Graphics: the lozenges' borders, the fill and the rules are `--zc-azul`, `--zc-ochre` or
    `--zc-edge`, each held at 3:1 or more by the tokens.
- **Motion:** only the lozenge's change and the smooth jump to a chapter; both stop under reduced
  motion.

## Tokens used
- **Grounds and rules:** `--zc-bg-warm`, `--zc-bg-white` (race cards), `--zc-border-light`,
  `--grout` (the head's tile).
- **Text:** `--zc-text-heading`, `--zc-text-body`, `--zc-text-muted`.
- **Colour accents:** `--zc-azul`, `--zc-azul-deep`, `--zc-ochre`, `--zc-ochre-text`, `--zc-edge`.
- **Scale and type:** the `--zc-space-*` scale, `--zc-font-heading`, `--zc-font-body`,
  `--zc-font-mono`, `--zc-transition-*`.

No new token. The mock-up's annotation red (`#9e2b25`) is the mock-up's only and never goes into the
app.

## Cases
`docs/examples/about.md`, IDs `ABOUT-nn` and `ABOUT-P-nn`, with the decisions and the slices.
