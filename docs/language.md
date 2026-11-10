# Language rules and glossary: zuacaldeira.com

How the German and Portuguese copy is written, so every page reads as one voice. English
(`en.ts`, the seeds' `en` rows) is the source; `de` and `pt` are drafted from it by hand. No
translation service is used. Every session that writes or changes de or pt copy reads this file
first. A term not in the glossary is proposed here before it goes into the copy.

Status of a rule or a term:
- **agreed (Zua, date)**: Zua's decision.
- **agreed (example ID)**: in copy that an agreed example pins word for word; changing it changes
  that example and its tests.
- **proposed**: drafted here, for Zua to decide. Until decided, follow it, but do not pin it in a test.

## Decisions

| ID | Rule | Status |
|---|---|---|
| L1 | Portuguese is the Portuguese of Portugal (pt-PT), never Brazilian. | agreed (Zua, 2026-11-10) |
| L2 | German addresses the reader with "du", never "Sie"/"Ihr"/"Ihnen". | agreed (Zua, 2026-11-10) |
| L3 | Informal and friendly when the copy speaks to the reader (calls to action, the footer, the contact page, the 404 page). Formal for concepts, theory and science: no address at all, plain statements, the field's own terms. | agreed (Zua, 2026-11-10) |
| L4 | "Session types" in Portuguese is "tipos de sessão". | agreed (Zua, 2026-11-10) |
| L5 | Notation is never translated: session types, `⊤`, `⊥`, `‖`, `ℒ(S)/≡`, `&{…}`, `+{…}`, atom labels. Neither are paper titles, venue names, the paper's abstract and its four statements. | agreed (`docs/tdd.md`; WR-LIST-07, SW-PROOF-01, HOME-PAPER-04) |
| L6 | Portuguese addresses the reader with "tu" (`fala comigo`, `o teu sistema`), the informal form of pt-PT; where a sentence reads as well without address, leave the address out. Never "você", never the "você" imperative (`entre`, `veja`). | proposed |
| L7 | Portuguese follows the 1990 spelling agreement, as pt-PT does officially and the copy already does: `ação`, `atualmente`, `deteta`, `selecionados`, `refatorar`; but pt-PT forms where the two norms still differ: `contacto`, `facto`, `receção`, `registo`, `equipa`, `ecrã`, `ficheiro`. | proposed |
| L8 | Portuguese avoids the Brazilian gerund for an ongoing or accompanying action: `estou a fazer`, `e treino`, not `estou fazendo`, `treinando`. | proposed |
| L9 | German writes "du", "dein", "dir" in lower case (Duden's recommendation for web copy). | proposed |
| L10 | Headings and labels in German and Portuguese are in sentence case: `Para além do trabalho`, not `Para Além do Trabalho`. German nouns keep their capital, of course. | proposed |
| L11 | Quotation marks: German „…“, Portuguese «…». (The copy already does so.) | proposed |
| L12 | Established English terms of the field stay where German or Portuguese speakers use them too (`Paper`, `Commit`, `Hook`, `Frontend`, `Backend`, `Stack`); everyday English (`connect`, `website` in pt, `pair`, `batch` as bare words) is translated. | proposed |
| L13 | Open question: German job and role nouns (`Entwickler`, `Besucher`, `Leser`) in the generic masculine, as today, or in a neutral form where one exists (`Entwicklerin oder Entwickler`, `Lesende`)? The copy uses the masculine; nothing changes until Zua decides. | open |

### What stays English in every language
- **Names:** Alexandre Zua Caldeira, Kita Casa Azul, Kita Dienstplan, Casa Azul, the co-authors,
  ResearchGate, Strava, GitHub.
- **Tools:** reticulateP, reticulab (`reticulab serve`), Lean 4, Angular, Angular Material,
  Spring Boot, Java, Python, pytest, Hypothesis, Server-Sent Events, nginx, PostgreSQL, TypeScript.
  The stack lines are lists of names and are the same in every language.
- **Papers:** titles, venues (ICE 2026, POPL 2010, FOOL 2009, EPTCS, DI/FCUL TR-07-7), the
  ICE 2026 abstract, the four statements and their names ("Reticulate Theorem", "SCC quotient",
  "End", "Duality isomorphism").
- **Notation and labels inside drawings:** the lattice's atom labels, `2³`, step names of the
  workflow type quoted from it ("Run").
- **German terms on the Portuguese page that name a German thing:** `Erzieher`, `Facharbeiten`,
  `Dienstplan`, `Silvesterlauf`, each glossed in Portuguese the first time.

## Glossary

| English | Deutsch | Português | Status | Note |
|---|---|---|---|---|
| session type | Session-Typ (pl. Session-Typen) | tipo de sessão | pt: agreed (Zua, 2026-11-10); de: proposed | Hyphenated in German, as all the copy has it. Never "Session Types" inside a German or Portuguese sentence. |
| global type | globaler Typ | tipo global | proposed | |
| subtype | Subtyp | subtipo | proposed | |
| session (an agent's working session) | Sitzung | sessão | proposed | Not the "session" of "session type". |
| lattice | Verband | reticulado | agreed (HOME-HERO-08) | |
| bounded lattice | beschränkter Verband | reticulado limitado | proposed | Only inside the statements today, which stay English (L5). |
| distributive / not distributive | distributiv / nicht distributiv | distributivo / não distributivo | proposed | |
| state space | Zustandsraum | espaço de estados | proposed | |
| state, transition | Zustand, Übergang | estado, transição | proposed | |
| well-formed | wohlgeformt | bem formado | proposed | |
| protocol | Protokoll | protocolo | proposed | |
| (a protocol) holds | halten / eingehalten werden (see LA-08) | cumprir-se | proposed | The hero's headline and the Software page's proof line. |
| hold (an agent) to a protocol | an ein Protokoll binden | sujeitar a um protocolo (see LA-21) | proposed | |
| duality | Dualität | dualidade | proposed | |
| benchmark protocols | Benchmark-Protokolle | protocolos de referência | proposed | |
| mechanised proof; mechanised in Lean 4 | mechanisierter Beweis; in Lean 4 mechanisiert | prova mecanizada; mecanizado em Lean 4 | proposed | German alternative "maschinell geprüfter Beweis" reads more plainly; "mechanisiert" is the field's word. |
| Theorem, Definition, Lemma, Proposition | Satz, Definition, Lemma, Proposition | Teorema, Definição, Lema, Proposição | agreed (HOME-PAPER-02, 03) | |
| paper | Paper (das; pl. Paper) | artigo | agreed (HOME-PAPER-01, WR-LIST-07) | Not "Artikel" in German, not "paper" in Portuguese. |
| workshop paper, conference paper, technical report | Workshop-Paper, Konferenz-Paper, Technischer Bericht | artigo de workshop, artigo de conferência, relatório técnico | agreed (WR-LIST-07) | |
| abstract | Zusammenfassung | resumo | proposed | |
| camera-ready | Druckfassung | versão final | proposed | |
| research | Forschung | investigação | proposed | Never "pesquisa". |
| researcher | Forscher | investigador | proposed | Never "pesquisador". |
| test-first | testgetrieben | com os testes primeiro | proposed | |
| test-driven (TDD) | testgetrieben (TDD) | guiado por testes (TDD) | proposed | |
| test list | Testliste | lista de testes | proposed | |
| coverage | Abdeckung | cobertura | proposed | |
| refactor | refaktorisieren | refatorar | proposed | |
| commit (verb) | committen | fazer commit | proposed | |
| a test bites | ein Test greift | um teste deteta a falha | proposed | |
| sabotage, triangulation | Sabotage, Triangulation | sabotagem, triangulação | proposed | |
| monitor | Monitor | monitor | proposed | |
| agent; AI agent; coding agent | Agent; KI-Agent; Coding-Agent | agente; agente de IA; agente de programação | proposed | |
| pair mode, batch mode | Pair-Modus, Batch-Modus | em par, em lote | proposed | See LA-09. |
| live view | Live-Ansicht | vista ao vivo | proposed | |
| verification tool; tool implementation | Verifikationswerkzeug; Werkzeug-Implementierung | ferramenta de verificação; implementação | proposed | |
| software engineer | Softwareentwickler | engenheiro de software | proposed | |
| developer | Entwickler | programador | proposed | Never "desenvolvedor". See L13. |
| website | Website | site | proposed | Never "website" in Portuguese copy (LA-15, LA-17, LA-18). |
| web application | Webanwendung | aplicação web | proposed | Not "aplicativo". |
| link | Link | ligação | proposed | |
| download | herunterladen | descarregar | proposed | Never "baixar". |
| repository | Repository | repositório | proposed | |
| front end, back end | Frontend, Backend | frontend, backend | proposed | |
| prerendered | vorgerendert | pré-renderizado | proposed | |
| role-based access | rollenbasierter Zugriff | acesso por perfis | proposed | Two forms in pt today (LA-19). |
| team | Team | equipa | proposed | Never "time", "equipe". |
| kindergarten (Casa Azul) | Kita | jardim de infância | proposed | Not "Kindergarten" in German (LA-05 to 07). |
| contact | Kontakt | contacto | proposed | Never "contato". |
| new tab | neuer Tab | novo separador | proposed | Never "aba". |
| screen; file; record | Bildschirm; Datei; Eintrag | ecrã; ficheiro; registo | proposed | Never "tela", "arquivo", "registro". |

## Audit of the stored de and pt copy (2026-11-10)

Read: the seeds in `backend/src/main/resources/db/seed/` (`R__home_hero.sql`, `R__software.sql`,
`R__writing.sql`, `R__research.sql`, `R__shared.sql`) and `frontend/src/app/i18n/de.ts`, `pt.ts`.
`ContentService` holds no de or pt text. Nothing is changed yet.

**Clean:** no "você", "tela", "arquivo", "registro", "contato", "equipe", "time" (team), "baixar",
"pesquisa" anywhere; the seeds use no "Sie" and no gerund; quotation marks already follow L11.
The new pages (home hero, Software, Writing, Research, the paper band) are close to the rules.
Almost every finding is in the older `de.ts`/`pt.ts` text (About, Contact, footer, and the hidden
Work and Pädagogik pages).

Priority: **high** = shown on every page or breaks an agreed rule; **medium** = a page in the menu;
**low** = wording, or a hidden page (`/work`, `/paedagogik`).

### German

| ID | Page | Key | Current | Proposed | Why | Priority |
|---|---|---|---|---|---|---|
| LA-01 | every page (footer) | `de.ts` `footer.heading` | Sprechen wir über Ihr System. | Sprechen wir über dein System. | L2 | high |
| LA-02 | Contact | `de.ts` `contact.subtitle` | Lassen Sie uns vernetzen — kontaktieren Sie mich über einen dieser Kanäle. | Schreib mir über einen dieser Kanäle. | L2, L3 | high |
| LA-03 | Pädagogik (hidden) | `de.ts` `paedagogik.intro` | … Unten finden Sie meine Facharbeiten und Präsentationen aus dem Programm. | … Unten findest du meine Facharbeiten und Präsentationen aus der Ausbildung. | L2 | low |
| LA-04 | About | `de.ts` `about.journeyP1` | … erforschte ich die Welt der <strong>Session Types</strong> — … | … erforschte ich die Welt der <strong>Session-Typen</strong> — … | glossary | medium |
| LA-05 | About | `de.ts` `about.berlinP1` | … Software für den zweisprachigen portugiesisch-deutschen Kindergarten <strong>Kita Casa Azul</strong>. | … Software für die zweisprachige portugiesisch-deutsche <strong>Kita Casa Azul</strong>. | glossary ("Kindergarten Kita" says it twice) | medium |
| LA-06 | Work (hidden) | `de.ts` `projects[0].description` | Offizielle Website der Kita Casa Azul, ein zweisprachiger portugiesisch-deutscher Kindergarten in Berlin. Entwickelt mit Angular 21, Angular Material und SSR-Prerendering. | Offizielle Website der Kita Casa Azul, einer zweisprachigen portugiesisch-deutschen Kita in Berlin. Entwickelt mit Angular 21 und Angular Material, mit SSR vorgerendert. | grammar (the apposition must be genitive), glossary | low |
| LA-07 | Work (hidden) | `de.ts` `projects[1].description` | Dienstplan-Anwendung für das Team des Kindergartens Casa Azul. … | Dienstplan-Anwendung für das Team der Kita Casa Azul. … | glossary | low |
| LA-08 | Home, Software | `R__home_hero.sql` de `headline`; `R__software.sql` de `proof.kicker` | Ich baue Software und beweise, dass ihre Protokolle halten. / Warum die Protokolle halten | Ich baue Software und beweise, dass ihre Protokolle eingehalten werden. / Warum die Protokolle eingehalten werden | "halten" for "hold" is a calque; Zua's call, since HOME-HERO and SW-PROOF-01 pin the current words | medium |
| LA-09 | Software | `R__software.sql` de `lead.question`, `lead.result` | … im Pair mit dem Entwickler oder im Batch auf einer vereinbarten Testliste? / … im Pair mit mir. | … im Pair-Modus mit dem Entwickler oder im Batch-Modus über eine vereinbarte Testliste? / … im Pair-Modus mit mir. | L12: bare "im Pair", "im Batch" are not German | low |

### Portuguese

| ID | Page | Key | Current | Proposed | Why | Priority |
|---|---|---|---|---|---|---|
| LA-10 | every page (footer) | `pt.ts` `footer.heading` | Vamos falar do seu sistema. | Vamos falar do teu sistema. | L3, L6 ("seu" is the formal or Brazilian address) | high |
| LA-11 | Contact | `pt.ts` `contact.subtitle` | Vamos conectar — entre em contacto por qualquer um destes canais. | Fala comigo por qualquer um destes canais. | L6 ("entre" is the "você" imperative), L12 ("conectar") | high |
| LA-12 | About | `pt.ts` `about.journeyP1` | … explorei o mundo dos <strong>Session Types</strong> — … | … explorei o mundo dos <strong>tipos de sessão</strong> — … | L4 | high |
| LA-13 | About | `pt.ts` `about.subtitle` | De Lisboa a Berlim — uma jornada entre investigação, código, educação e corrida. | De Lisboa a Berlim — um percurso entre investigação, código, educação e corrida. | "jornada" in this sense is Brazilian; the section is already called "O percurso" | medium |
| LA-14 | About | `pt.ts` `about.beyondP1` | Sou corredor amador, treinando ao longo das estações de Berlim. … | Sou corredor amador e treino ao longo das estações de Berlim. … | L8 | medium |
| LA-15 | About | `pt.ts` `about.berlinP2` | No lado técnico, trabalho com … construindo desde o <strong>Website Casa Azul</strong> até à aplicação interna de … | Do lado técnico, trabalho com … e construí tudo, desde o <strong>site da Casa Azul</strong> até à aplicação interna de … | L8, glossary ("site"), pt-PT "do lado" | medium |
| LA-16 | About, Running | `pt.ts` `about.journeyHeading`, `about.beyondHeading`, `running.upcomingHeading` | O Percurso / Para Além do Trabalho / Próximas Corridas | O percurso / Para além do trabalho / Próximas corridas | L10 | medium |
| LA-17 | Work (hidden) | `pt.ts` `projects[0].description` | Website oficial da Kita Casa Azul, … Construído com Angular 21, Angular Material e SSR prerendering. | Site oficial da Kita Casa Azul, … Construído com Angular 21 e Angular Material, pré-renderizado com SSR. | glossary | low |
| LA-18 | Work (hidden) | `pt.ts` `projects[3].description` | Este website pessoal — construído com Angular 21, Material 3, SSR prerendering e implementado no GitHub Pages. | Este site pessoal — construído com Angular 21, Material 3 e pré-renderização SSR, e publicado no GitHub Pages. | glossary; "implementado" for "deployed" is Brazilian. (GitHub Pages is out of date in all three languages: content, Zua's call.) | low |
| LA-19 | Software; Work (hidden) | `R__software.sql` pt `work.rows[1].text`; `pt.ts` `projects[1].description` | … com acesso por funções. / … acesso baseado em funções. | … com acesso por perfis. / … acesso por perfis. | one term (glossary) | low |
| LA-20 | Pädagogik (hidden) | `pt.ts` `facharbeiten[3].description` | Reflexão e resumo de filme revisado sobre antroposofia … | Versão revista da reflexão e do resumo de filme sobre antroposofia … | "revisado" is Brazilian; pt-PT "revisto" | low |
| LA-21 | Software | `R__software.sql` pt `head.intro`, `lead.title` | … como o prendo ao seu protocolo … / Um monitor que prende um agente de programação ao seu protocolo de TDD | … como o sujeito ao seu protocolo … / Um monitor que sujeita um agente de programação ao seu protocolo de TDD | one term with the hero's "sujeitos a um protocolo verificado"; "prender" reads as "to lock up". SW-HEAD/SW-LEAD examples may pin the words | low |
| LA-22 | About; Pädagogik (hidden) | `pt.ts` `about.berlinP1`, `paedagogik.intro` | … reconhecido pelo estado … | … reconhecido pelo Estado … | the State is capitalised in pt-PT | low |
| LA-23 | Pädagogik (hidden) | `pt.ts` `paedagogik.tabPraesentationen` | Präsentationen | Apresentações | a German word with a plain Portuguese equivalent ("Facharbeiten" names a German school form and can stay) | low |

**Count:** 23 findings: German 9, Portuguese 14. High 5 (LA-01, 02, 10, 11, 12),
medium 7, low 11. All five high ones are live: the footer on every page, the Contact page, About.

## Next steps (proposed)
1. Zua decides the proposed rules (L6 to L13) and terms, and LA-08 and LA-21, which change pinned copy.
2. Fix the findings test-first, high ones first, in `de.ts`, `pt.ts` and the seeds.
3. A build test that guards this file: every built `/de/...` and `/pt/...` page is read for the
   forbidden forms (`Sie`, `Ihr`, `Ihnen`, `Ihre` as address; `você`, `tela`, `arquivo`, `registro`,
   `contato`, `equipe`, `baixar`, `pesquisa`, `Session Types` inside a sentence), with an allow-list
   for names and notation. The forbidden list lives here in a machine-readable block, so the
   test and the glossary cannot drift.
