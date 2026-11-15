# About page: notes for the mock-up

Status: **decisions from Zua, 2026-11-15**, after ui-design-peer's proposal the same day. The mock-up
(`about.html`, compared in `index.html`) shows two options. Once one is chosen, the build spec
(`about-spec.md`) and the examples file (`docs/examples/about.md`) follow.

The page: `/en/about`, `/de/about` ("Über mich"), `/pt/about` ("Sobre"). It is in the menu (Software,
Research, Writing, About) and the home hero's first button leads to it.

## What the page is for (Zua, 2026-11-15)

> "this section will tell my CV in prose, what I've done as a Person not only as software engineer."

About is Zua's CV told as a story, the whole person, not a short summary with links to the other
pages. The home page makes the claim in one sentence; About tells the life behind it. Readers, from
`docs/design.md`: hiring managers who want the path and the CV, researchers who want to know where
the background comes from, teams building AI agents who want to know whom they would work with.

## Decisions

- **AB-D1. Order: along the route.** One chapter per stop, Piri → Estremoz → Lisbon → Berlin
  (`hero.location` in `frontend/src/app/i18n/*.ts`, shown on today's home hero): where Zua was, what
  Zua learned or did there (school, studies, research, work, education, running), and why Zua moved
  on. The route drawing is the page's figure and its table of contents: each stop links to its
  chapter.
- **AB-D2. Pedagogy is part of the Berlin chapter,** told as a turn in Zua's life: the Erzieher
  training at the Freie Fachschule Berlin, Kita Casa Azul, and where it meets the software (Kita
  Dienstplan).
- **AB-D3. Facts: ui-design-peer drafts, Zua fills.** The prose is drafted only from what is in the
  repository (the old About page and its i18n texts, the home page, Software, Research, Writing, the
  seeds). Every fact not there is a plainly marked gap in the text for Zua to fill: childhood in Piri
  and Estremoz, school, years, the move to Berlin and why, and the four facts to confirm (where Zua
  grew up, the supervision, the degree's name, "since 2011"). Nothing is invented, not even a
  linking sentence that states a fact.
- **AB-D4. Running:** words, the Strava link, and the two finished races with their times
  (Silvesterlauf Berlin, 31 December 2025, 10 km, 48:32; Berliner Halbmarathon, 6 April 2025,
  21.1 km, 1:52:15), from `ContentService.races`. The `#running` anchor stays (HOME-HERO-09: the home
  lattice's `running` leads to `/l/about#running`).
- **AB-D5. Embassy of Angola website:** stays, in the Berlin chapter.
- **AB-D6. No photo for now:** the route is the figure.
- **AB-D7. CV:** the CV PDF is a link at the end of the page once the file exists; nothing is shown
  until then (home D16).
- **AB-D8. No short option.** The one-screen summary (option C of the proposal) is dropped: it does not
  tell a story.
- **AB-D9. Two mock-up options,** both a story along the route, differing in how the route and the
  chapters meet: A, the route as a figure at the top and the chapters below in order; B, the route
  running down the page beside the chapters, each stop marking its chapter as you read. English only
  in this round, at 390 and 1280 px, light and dark, with the shared header (Losango mark) and footer.

## Where each fact comes from

| Fact | Source |
|------|--------|
| The route Piri → Estremoz → Lisbon → Berlin | `hero.location` in `i18n/en.ts` (shown on the home hero) |
| Studied at the University of Lisbon; session types as "a type discipline for concurrent and distributed systems that guarantees communication safety by construction"; "types as specifications, programs as proofs, correctness by design" | old About, `about.journeyP1`, `journeyP2` |
| ConGu (2007, DI/FCUL TR-07-7), Dynamic Interfaces (FOOL 2009), Modular Session Types for Distributed Object-Oriented Programming (POPL 2010), with their co-authors | `R__writing.sql` |
| Angular and Spring Boot; the Casa Azul website; the Dienstplan; the Embassy of Angola in Berlin's web presence; "a new calling: early childhood education"; training as an Erzieher at the Freie Fachschule Berlin | old About, `about.berlinP1`, `berlinP2` |
| Kita Casa Azul is a bilingual Portuguese-German Kita in Berlin; Kita Dienstplan is shift planning for its team (Angular, Spring Boot, Java, PostgreSQL, role-based access) | `R__software.sql`, `software/work` |
| "Java backends, verification tooling, and AI agents held to a checked protocol" | `R__home_hero.sql`, the stored lede (not shown on today's home page) |
| Session Type State Spaces Form Lattices, ICE 2026, sole author, camera-ready, to appear in EPTCS; reticulateP | `R__writing.sql`, `R__research.sql`, `software/work` |
| The TDD monitor, in use on this site since November 2026 | `R__software.sql`, `software/lead` |
| Amateur runner through Berlin's seasons; running "keeps me grounded and gives structure to everything else" | old About, `about.beyondP1` |
| The two races and times; the Strava profile | `ContentService.races`, `ContentService.socialLinks` |

## To confirm (Zua)

- **Where Zua grew up.** The old page says Lisbon; the route starts in Piri.
- **The supervision.** The old page says Vasco T. Vasconcelos supervised the session-types research;
  the Writing page shows him as a co-author only.
- **The degree's name.** The old page says "Computer Science and Informatics Engineering".
- **"Since 2011".** Only in the home hero's stored lede ("Software engineer in Berlin since 2011").
- **The Berlin Marathon.** The old page says "From the Silvesterlauf to the Berlin Marathon"; the race
  list has it on 27 September 2026, still marked upcoming. It is not shown until Zua says.
