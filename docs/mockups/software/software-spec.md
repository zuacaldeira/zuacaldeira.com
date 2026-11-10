# Build spec: Software page

Chosen on 2026-11-08: **option 1, lead plus list.** Visual reference: `software.html` beside this
file (`#opt=1`), or `index.html` to compare; screenshots in `screenshots/opt1-*.png`. Options 2
and 3 stay in the mock-up for comparison and are not built. Mock-ups are not production code: do
not copy their markup. The behaviour is in `docs/examples/software.md`, built test-first.

## Purpose
The home page's "See selected work" and the lattice's `software` atom lead here (HOME-HERO-01 to
03, 09). The page shows that the software is built to a protocol and holds to it. Readers, from
`docs/design.md`:
- **Teams building AI agents** want a case study about keeping an agent in line, and then the
  contact. The lead piece is that case study, and the footer holds the contact.
- **Hiring managers and recruiters** skim for a minute: what he builds, in what stack. The three
  rows under "More work" answer that.
- **Researchers** find the theorem and the paper in the proof band at the end.

## Sections, in order
1. **Head:** eyebrow, `<h1>` "Software", one intro sentence (a draft, D3), on the hero's lozenge
   tile.
2. **Lead case study:** the TDD monitor, in full (below).
3. **More work:** reticulateP, Kita Dienstplan, Casa Azul website, in that order (D1).
4. **How I work:** three steps and one checked global type.
5. **Proof:** the home page's theorem band, short: Theorem 15, the evidence line, two buttons.
6. **Footer:** the shared footer (SHELL-07), unchanged.

The header is the shared one; its "Software" link is current (`aria-current="page"`, the ochre
underline that the language codes use).

## Layout per width
One column of 1200 px, gutter 24 px (16 px under `Handset`), as on the home page.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Head | Eyebrow, `<h1>`, intro, stacked | The same | The same, intro up to 40 rem |
| Lead | One column: text, then the Run figure, then the monitor screenshot | One column | Text 1.35fr, side column 1fr (figure, screenshot), gap `clamp(32px, 5vw, 72px)`; the side column is sticky at `top: 88px` |
| More work | One column per row: kicker and title, text, stack, links | One column | Three columns per row: 0.9fr, 1.5fr, 1fr |
| How I work | Steps stacked, the type above its caption | Stacked | Three steps in a row; the type (1.3fr) beside its caption (1fr) |
| Proof | One column | One column | One column |

The switch to one column is at 900 px. Measured in the mock-up: page height 5,440 px at 390 (en),
5,810 px (de); 3,465 px at 1280 (en), 3,732 px (de).

## Components
- **Header, footer, language links, theme button, phone menu:** the existing shell
  (`docs/examples/shell.md`).
- **Tile pattern:** the hero's two `repeating-linear-gradient`s (`home-spec.md`), on the head.
- **New, `WorkLead`:** the lead case study. Kicker (Plex Mono, `--zc-ochre-text`), `<h2>`
  (Fraunces 600, `clamp(1.9rem, 3.6vw, 2.9rem)`), a status line in Plex Mono after an ochre
  lozenge (10 px, 45°, decorative), then five labelled blocks: the question, what I built, the
  protocol behind it, the live view, the result; then the stack. Each label is a small heading
  (Plex Mono 0.75 rem, upper case, `--zc-text-muted`) for the block it heads.
- **New, `SessionType`:** a `<pre>` in Plex Mono 0.875 rem (0.8125 rem below 480 px),
  `--zc-bg-white` with a 3 px `--zc-azul` left border, `translate="no"`. A caption under it, in
  Plex Mono 0.75 rem. Line breaks: the Run line is set over three lines at its commas (whitespace
  only); the global type is one line that wraps at spaces (`white-space: pre-wrap`), so a copy
  gives exactly the checked line.
- **New, `RunFigure`:** the Run step drawn like the lattice, inline SVG, `viewBox="0 0 400 230"`:
  `Run` (ochre node) → `&{runTest}` (a solid edge, the action) → `+RED`, `+WRONG_RED`, `+GREEN`
  (dashed edges, the results) → `Code`, `Fix`, `Green` (open nodes). Labels are notation, never
  translated, with a background halo as in the lattice. `role="img"`, its `aria-label` and its
  `<figcaption>` the translated caption. Action and result differ by line style and label, not
  colour alone.
- **New, `MonitorShot`:** the screenshot, a link to the full-size file around the image, then a
  caption. Files: `public/assets/software/reticulab-live-light.png` and `-dark.png` (1440 × 900,
  about 150 kB each, copied there on 2026-11-08). The dark image shows on dark glazes, the light
  one on light glazes, from the same mode the glaze engine sets; give `width`, `height` and
  `loading="lazy"`. Its alt text is translated (copy below). The screenshot's own text is English
  in every language: it is a picture of a tool.
- **New, `WorkRow`:** one row of "More work": kicker, `<h3>` (Fraunces 600, 1.5 rem), text, the
  stack, links. Rows separated by a `--zc-border-light` rule.
- **New, `HowStrip`:** an `<ol>` of three steps, each with a 2 px `--zc-azul` rule above, its
  number in Plex Mono `--zc-ochre-text`, an `<h3>` and a sentence; on `--zc-bg-white`, then a
  `SessionType` and its caption.
- **Theorem band:** the home page's, its `.band` colours (`home-spec.md`), with Theorem 15, the
  evidence line and two `Button`s. Without the lattice drawing and the unfold.
- **Button, text links:** as on the home page. Links in running text underlined, 44 px tall.

## Content
Text comes from the content API through the build's snapshot, page `software`, one JSON object
per section (D21 in `home.md`), unless the developer decides otherwise (D7 in `software.md`).
Notation, the names reticulateP, Kita Dienstplan, `reticulab serve`, the stacks, and the paper
title and theorem are the same in every language.

### Copy (en / de / pt)
| Key | en | de | pt |
|-----|----|----|----|
| `title` | Alexandre Zua Caldeira — Software | Alexandre Zua Caldeira — Software | Alexandre Zua Caldeira — Software |
| `head.eyebrow` | Selected work | Ausgewählte Arbeiten | Trabalhos selecionados |
| `head.h1` | Software | Software | Software |
| `head.intro` (draft, D3) | Software I have built, and how I hold it to its protocol: written down first, checked, then built test-first. | Software, die ich gebaut habe, und wie ich sie an ihr Protokoll binde: zuerst aufgeschrieben, geprüft, dann testgetrieben gebaut. | Software que construí, e como o prendo ao seu protocolo: primeiro escrito, depois verificado, depois construído com os testes primeiro. |
| `lead.kicker` | Case study · AI agents | Fallstudie · KI-Agenten | Estudo de caso · agentes de IA |
| `lead.title` | A monitor that holds a coding agent to its TDD protocol | Ein Monitor, der einen Coding-Agenten an sein TDD-Protokoll bindet | Um monitor que prende um agente de programação ao seu protocolo de TDD |
| `lead.status` | In use on this site since November 2026 | Auf dieser Website im Einsatz seit November 2026 | Em uso neste site desde novembro de 2026 |
| `label.question` | The question | Die Frage | A pergunta |
| `label.built` | What I built | Was ich gebaut habe | O que construí |
| `label.protocol` | The protocol behind it | Das Protokoll dahinter | O protocolo por trás |
| `label.live` | The live view | Die Live-Ansicht | A vista ao vivo |
| `label.result` | The result | Das Ergebnis | O resultado |
| `label.stack` | Stack | Stack | Tecnologias |
| `lead.question` | Does a session type make an AI coding agent’s test-driven work better, and in which mode: in pair with the developer, or in batch on an agreed test list? Better means tests that are meaningful for the work, not coverage. | Macht ein Session-Typ die testgetriebene Arbeit eines KI-Coding-Agenten besser, und in welchem Modus: im Pair mit dem Entwickler oder im Batch auf einer vereinbarten Testliste? Besser heißt: Tests, die für die Arbeit Bedeutung haben, nicht Abdeckung. | Um tipo de sessão torna melhor o trabalho guiado por testes de um agente de programação de IA, e em que modo: em par com o programador, ou em lote, sobre uma lista de testes acordada? Melhor quer dizer testes com significado para o trabalho, não cobertura. |
| `lead.built` | A monitor that watches a TDD agent as it works, through the agent’s hooks, and checks every step against a session type of the TDD workflow: write a test, run it, see it fail for the right reason, make it pass, refactor, commit. Where a type is given, it refuses a step the type does not allow; otherwise it only observes. | Ein Monitor, der einem TDD-Agenten über dessen Hooks bei der Arbeit zusieht und jeden Schritt gegen einen Session-Typ des TDD-Ablaufs prüft: Test schreiben, ausführen, aus dem richtigen Grund scheitern sehen, grün machen, refaktorisieren, committen. Ist ein Typ vorgegeben, verweigert er jeden Schritt, den der Typ nicht erlaubt; sonst beobachtet er nur. | Um monitor que observa um agente de TDD enquanto trabalha, através dos hooks do agente, e verifica cada passo contra um tipo de sessão do fluxo de TDD: escrever um teste, corrê-lo, vê-lo falhar pela razão certa, pô-lo a passar, refatorar, fazer commit. Quando há um tipo dado, recusa qualquer passo que o tipo não permita; caso contrário, apenas observa. |
| `lead.built2` | It also reports which parts of the target’s own session types the agent’s tests reach: what the software under test must do, failure paths included. | Er zeigt auch, welche Teile der Session-Typen des Ziels die Tests des Agenten erreichen: was die getestete Software tun muss, Fehlerpfade eingeschlossen. | Mostra também que partes dos tipos de sessão do próprio alvo os testes do agente alcançam: o que o software em teste tem de fazer, incluindo os caminhos de falha. |
| `lead.runCaption` | A line of the workflow type, word for word. | Eine Zeile des Ablauftyps, wörtlich. | Uma linha do tipo do fluxo, palavra por palavra. |
| `lead.protocol` | What the agent does (`&{…}`) is kept apart from the results it receives (`+{…}`). The full workflow type has 56 states and 89 transitions and is a lattice, checked with reticulateP. The variants for sabotage (breaking the code on purpose to show a test bites) and for triangulation are subtypes of it. | Was der Agent tut (`&{…}`), ist getrennt von den Ergebnissen, die er erhält (`+{…}`). Der vollständige Ablauftyp hat 56 Zustände und 89 Übergänge und ist ein Verband, geprüft mit reticulateP. Die Varianten für Sabotage (den Code absichtlich brechen, um zu zeigen, dass ein Test greift) und für Triangulation sind Subtypen davon. | O que o agente faz (`&{…}`) fica separado dos resultados que recebe (`+{…}`). O tipo completo do fluxo tem 56 estados e 89 transições e é um reticulado, verificado com o reticulateP. As variantes para sabotagem (partir o código de propósito para mostrar que um teste deteta a falha) e para triangulação são subtipos dele. |
| `lead.figure` | The Run step: one action of the agent, three results it receives. | Der Schritt Run: eine Aktion des Agenten, drei Ergebnisse, die er erhält. | O passo Run: uma ação do agente, três resultados que recebe. |
| `lead.live` | `reticulab serve`, a small read-only web app, follows each session live: what is being built, in plain sentences; the agreed test list, N of M done; the target’s coverage; where the agent is in its type; and a slider to replay the steps. | `reticulab serve`, eine kleine Web-App nur zum Lesen, folgt jeder Sitzung live: was gerade gebaut wird, in einfachen Sätzen; die vereinbarte Testliste, N von M erledigt; die Abdeckung des Ziels; wo der Agent in seinem Typ steht; und ein Regler, der die Schritte noch einmal abspielt. | `reticulab serve`, uma pequena aplicação web só de leitura, acompanha cada sessão ao vivo: o que está a ser construído, em frases simples; a lista de testes acordada, N de M feitos; a cobertura do alvo; onde o agente está no seu tipo; e um cursor para rever os passos. |
| `lead.shotAlt` | The monitor’s live view while the agent built this site’s redirects for old links: on the left, what is being built, in plain sentences, each marked “passed at once” or “failed first, then passed”; on the right, the agent’s map of its 56-state type, at its end. | Die Live-Ansicht des Monitors, während der Agent die Weiterleitungen alter Links dieser Website baute: links, was gebaut wird, in einfachen Sätzen, jeweils als „sofort bestanden“ oder „erst gescheitert, dann bestanden“ markiert; rechts die Karte des Agenten in seinem Typ mit 56 Zuständen, an dessen Ende. | A vista ao vivo do monitor enquanto o agente construía os redirecionamentos de ligações antigas deste site: à esquerda, o que está a ser construído, em frases simples, cada uma marcada como «passou à primeira» ou «falhou primeiro, depois passou»; à direita, o mapa do agente no seu tipo de 56 estados, no fim. |
| `lead.shotCaption` | The live view while the agent built this site’s redirects for old links. | Die Live-Ansicht, während der Agent die Weiterleitungen alter Links dieser Website baute. | A vista ao vivo enquanto o agente construía os redirecionamentos de ligações antigas deste site. |
| `lead.result` | In use on this site since November 2026: every element of its header and footer was built test-first by an agent under the monitor, in pair with me. | Auf dieser Website im Einsatz seit November 2026: Jedes Element ihres Kopf- und Fußbereichs hat ein Agent unter dem Monitor testgetrieben gebaut, im Pair mit mir. | Em uso neste site desde novembro de 2026: cada elemento do seu cabeçalho e rodapé foi construído com os testes primeiro por um agente sob o monitor, em par comigo. |
| `work.heading` | More work | Weitere Arbeiten | Outros trabalhos |
| `work.ret.kicker` | Verification tool | Verifikationswerkzeug | Ferramenta de verificação |
| `work.ret.text` | Builds the state space of a session type and checks that it forms a lattice. It turned the ICE 2026 paper’s 108 benchmark protocols into lattices, is one of the paper’s two independent tool implementations, and checks every session type on this site. | Baut den Zustandsraum eines Session-Typs und prüft, ob er einen Verband bildet. Es hat die 108 Benchmark-Protokolle des ICE-2026-Papers in Verbände übersetzt, ist eine der beiden unabhängigen Werkzeug-Implementierungen des Papers und prüft jeden Session-Typ auf dieser Website. | Constrói o espaço de estados de um tipo de sessão e verifica que forma um reticulado. Transformou em reticulados os 108 protocolos de referência do artigo ICE 2026, é uma das duas implementações independentes do artigo e verifica cada tipo de sessão deste site. |
| `work.ret.paper` | Read the paper (PDF) | Paper lesen (PDF) | Ler o artigo (PDF) |
| `work.kita.kicker` | Web application | Webanwendung | Aplicação web |
| `work.kita.text` | Shift planning for the team of Kita Casa Azul, a bilingual Portuguese-German kindergarten in Berlin: an Angular front end and a Spring Boot back end, with role-based access. | Dienstplanung für das Team der Kita Casa Azul, einer zweisprachigen portugiesisch-deutschen Kita in Berlin: ein Angular-Frontend und ein Spring-Boot-Backend, mit rollenbasiertem Zugriff. | Planeamento de turnos para a equipa da Kita Casa Azul, um jardim de infância bilingue português-alemão em Berlim: frontend em Angular e backend em Spring Boot, com acesso por funções. |
| `work.casa.kicker` | Website | Website | Site |
| `work.casa.title` | Casa Azul website | Website der Casa Azul | Site da Casa Azul |
| `work.casa.text` | The website of Kita Casa Azul, the bilingual Portuguese-German kindergarten in Berlin, prerendered with Angular so every page loads as plain HTML. | Die Website der Kita Casa Azul, der zweisprachigen portugiesisch-deutschen Kita in Berlin, mit Angular vorgerendert, sodass jede Seite als reines HTML lädt. | O site da Kita Casa Azul, o jardim de infância bilingue português-alemão em Berlim, pré-renderizado com Angular, para que cada página carregue como HTML simples. |
| `work.repo` | Repository | Repository | Repositório |
| `how.heading` | How I work | Wie ich arbeite | Como trabalho |
| `how.1.title` / `.text` | Protocol first / The behaviour is agreed as examples and written as a session type before any code exists. | Erst das Protokoll / Das Verhalten wird als Beispiele vereinbart und als Session-Typ aufgeschrieben, bevor es Code gibt. | Primeiro o protocolo / O comportamento é acordado em exemplos e escrito como um tipo de sessão antes de haver código. |
| `how.2.title` / `.text` | Test-first, one step at a time / Each test is seen to fail for the right reason, then made to pass; then the code is tidied and committed. | Testgetrieben, Schritt für Schritt / Jeder Test scheitert erst sichtbar aus dem richtigen Grund, dann wird er grün; dann wird aufgeräumt und committet. | Testes primeiro, um passo de cada vez / Cada teste é visto a falhar pela razão certa e depois posto a passar; depois o código é arrumado e vai para commit. |
| `how.3.title` / `.text` | Every forbidden path shown red / What the protocol rules out gets a test too, and each such test is broken once on purpose, to prove it bites. | Jeder verbotene Pfad einmal rot / Was das Protokoll ausschließt, bekommt auch einen Test, und jeder solche Test wird einmal absichtlich gebrochen, um zu zeigen, dass er greift. | Cada caminho proibido visto a vermelho / O que o protocolo exclui também tem um teste, e cada um desses testes é partido uma vez de propósito, para provar que deteta a falha. |
| `how.caption` | From this site, as a checked global type: the page gives the visitor its links, the visitor asks nginx, and nginx answers 200. There is no redirect branch (SHELL-04). | Von dieser Website, als geprüfter globaler Typ: Die Seite gibt dem Besucher ihre Links, der Besucher fragt nginx, und nginx antwortet mit 200. Einen Umleitungszweig gibt es nicht (SHELL-04). | Deste site, como tipo global verificado: a página dá ao visitante as suas ligações, o visitante pede ao nginx, e o nginx responde 200. Não há ramo de redirecionamento (SHELL-04). |
| `proof.kicker` | Why the protocols hold | Warum die Protokolle eingehalten werden | Porque é que os protocolos se cumprem |
| `proof.paper` | From the paper — Session Type State Spaces Form Lattices · ICE 2026 | Aus dem Paper — Session Type State Spaces Form Lattices · ICE 2026 | Do artigo — Session Type State Spaces Form Lattices · ICE 2026 |
| `proof.evidence`, `proof.read`, `proof.all` | The home band's `evidence`, `read`, `allResearch` | the same, de | the same, pt |

Not translated, the same in every language: the Run line, the global type, the figure's labels,
`reticulab serve`, the stacks, the names reticulateP and Kita Dienstplan, and the theorem
"For every well-formed session type S, ℒ(S)/≡ is a bounded lattice."

### Notation (checked 2026-11-08 by the developer, reticulateP main `7d20ba416`)
- **Run line:** `Run = &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}`, word for word
  line 10 of the lab's `types/agent/workflow/ext-generic.st` (56 states, 89 transitions, a
  lattice). Shown over three lines, broken at its commas.
- **Links protocol:** `Page -> Visitor : {links: Visitor -> Nginx : {get: Nginx -> Visitor :
  {ok200: end}}}`, a global type. Shown as one line that may wrap.
- Both go into `docs/notation/` with their check recorded, as `zua.st` did (D5).

### Stacks and links
| Piece | Stack | Links |
|-------|-------|-------|
| TDD monitor | Python · pytest · Hypothesis · Server-Sent Events · reticulateP | none: the lab is private, and there is no write-up yet (D2) |
| reticulateP | Python | the paper's PDF, `/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf`; no repository (private, D2) |
| Kita Dienstplan | Angular · Spring Boot · Java · PostgreSQL | https://github.com/zuacaldeira/kita-dienstplan (D8) |
| Casa Azul website | Angular · Angular Material · SSR prerendering · TypeScript | https://casa-azul-berlin.de, https://github.com/zuacaldeira/ca-website (D8) |

## States
- **Any time of day:** five glazes, from the engine. The screenshot follows the mode: light
  image on Manganês, Cobalto, Amarelo e verde; dark on the two night glazes.
- **Long text:** German is the longest (5,810 px at 390). The lead title takes three lines on
  a phone.
- **Missing translation:** the build fails, as for the hero (D4 in `home.md`).
- **No JavaScript:** Cobalto; the light screenshot.
- **Loading:** none. Prerendered; no API in the browser. The screenshot is lazy-loaded.
- **Empty:** none; the page lists fixed pieces.

## Accessibility
- One `<h1>`; `<h2>` per section (the lead's title, More work, How I work); `<h3>` per row and step.
- The label of each lead block is its heading (level 3), so a screen reader can jump between them.
- `RunFigure`: `role="img"` with the translated label; the result edges dashed as well as
  labelled `+`.
- `MonitorShot`: translated alt text; the link to the full image is named by it.
- Every link and button at least 44 px tall at 390 px (measured in the mock-up: none smaller).
- No horizontal scroll at 390 px (measured: `scrollWidth` 390 in en, de, and dark); the session
  types do not scroll sideways either.
- Contrast: tokens only. The mock-up's red placeholder tags are not part of the build.

## How the mock-up was checked
Option 1 at 390 and 1280 px in en and de (light), and 390 en (dark), full page, read by eye.
Measured: horizontal overflow, controls under 44 px, `<pre>` overflow, which screenshot shows per
mode, and that the global type on the page is exactly the checked line. Not checked: 768 and
1440 px, the three other glazes, Portuguese (drafted here, not in the mock-up), keyboard order.
The build needs its own review on `next` (`docs/design.md`).
