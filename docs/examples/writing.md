# Examples: Writing page

Status: **in mock-up.** The content decisions D1 to D7 were agreed with the developer on
2026-11-08. Two layout options are in `docs/mockups/writing/` (`index.html`) for the developer to
choose from. The cases (`WR-…`) and the build spec come once an option is chosen.

The Writing page in three languages, at `/en/writing`, `/de/writing` and `/pt/writing`. It is the
last page SHELL-11 waits for (Software, Forschung, Texte, Über mich, in `shell.md`). `home.md`
names writing among the home page's later sections (line 20), and `/de/writing` is the example of
a page that is not built in SHELL-04's P-04 and SW-PAGE-P-04 (`software.md`).

## Who reads it (from `docs/design.md`)

- **Researchers and reviewers** (laptop, from a paper or a talk): title, venue, year, co-authors,
  and the text itself, without hunting.
- **Hiring managers** (a quick look on a phone): does he publish, and where?
- **Teams building AI agents:** write-ups such as the monitor experiment, once they exist (D2 in
  `software.md`).

## Decisions

Agreed with the developer on 2026-11-08 (all six of ui-design-peer's recommendations):

- **D1. What counts as Writing:** the four papers now, and write-ups and essays as they come. The
  Research page later links to this list instead of keeping its own copy of the publications.
- **D2. The training papers** (`ContentService.facharbeiten`, F1 to F4, on the hidden
  `/paedagogik` page) stay out.
- **D3. Order:** newest first, one list: Session Type State Spaces Form Lattices (ICE 2026),
  Modular Session Types for Distributed Object-Oriented Programming (POPL 2010), Dynamic Interfaces
  (FOOL 2009), ConGu (DI/FCUL TR-07-7, 2007). The data is `ContentService.publications`.
- **D4. No sentence under a text** for now: no summary and no abstract.
- **D5. The Portuguese menu word and heading are "Textos"** (de "Texte", en "Writing"). The home
  mock-up's "escrita" is replaced.
- **D6. Every text links out, or to its PDF,** for now. A reading page for a text hosted on the site
  gets its own mock-up when the first such text exists.
- **D7. The Website v2 boards are not needed** for this page; it is designed from the repository.

## Drafts for the developer (in the mock-up, marked "Draft")

| Key | en | de | pt |
|-----|----|----|----|
| `head.eyebrow` | Published work | Veröffentlichungen | Publicações |
| `head.heading` | Writing | Texte | Textos |
| `head.intro` | Papers on session types, and on tools that check code against its specification, newest first. Each one links to where the text lives. | Paper über Session-Typen und über Werkzeuge, die Code gegen seine Spezifikation prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, wo der Text liegt. | Artigos sobre tipos de sessão e sobre ferramentas que verificam o código face à sua especificação, os mais recentes primeiro. Cada um leva ao sítio onde o texto está. |
