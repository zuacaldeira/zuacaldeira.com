# Examples: Shell

Status: **agreed with the developer on 2026-11-02.**

The header, language links and footer that every page shares. Design:
`docs/mockups/home/home-spec.md` (frame option A, agreed 2026-11-02). Built together with
the home hero, because the hero's page needs them.

## Cases

| ID | Given | When | Then | Covered |
|----|-------|------|------|---------|
| SHELL-01 | the built `/de/home` | the header is read | a navigation labelled "Sprache" has three links, `EN`, `DE`, `PT`, to `/en/home`, `/de/home`, `/pt/home`; each has `hreflang`, `lang` and the accessible name of its language in that language (English, Deutsch, Português); `DE` has `aria-current` and is underlined | |
| SHELL-02 | a visitor on `/de/research` | they follow `PT` | they reach `/pt/research`: the same page in the other language | |
| SHELL-03 | the built `/pt/home` | the footer is read | it lists English, Deutsch, Português as links, Português with `aria-current` | |
| SHELL-04 | the built pages in en, de and pt, and `/` and the 404 page (both English) | their links inside the site are read: the menu, the phone menu, the logo, the contact button, the footer, the hero's buttons | each starts with the page's language, `/de/about` on a German page, names a page of the build and has no trailing slash; none is an old path (`/about`), so no click takes a redirect (the D42 finding in `home.md`). Links to files (the paper's PDF) are not read | yes (build, 2026-11-04; P-01 to P-04) |
| SHELL-05 | the built header | it is read in each language | the contact button reads en "⊥ write to me", de "⊥ Kontakt", pt "⊥ Contacto", to `/xx/contact` | |
| SHELL-06 | a phone (the CDK `Handset` query) | the page loads | the bar shows the mark, `EN DE PT`, the theme button and the menu button, each at least 44 px, with no horizontal scroll at 390 px in all three languages; the name "Zua Caldeira" and the menu links are not in the bar | |
| SHELL-07 | any language | the footer is read | it shows en "⊥ end · every protocol ends here", de "⊥ end · hier endet jedes Protokoll", pt "⊥ end · todo o protocolo acaba aqui", the heading "Let's talk about your system." (de "Sprechen wir über Ihr System.", pt "Vamos falar do seu sistema."), the availability line en "Open to software engineering and research roles, and to collaborations on protocols, verification and agent systems.", de "Offen für Stellen in Softwareentwicklung und Forschung und für Zusammenarbeit zu Protokollen, Verifikation und Agentensystemen.", pt "Aberto a funções em engenharia de software e investigação, e a colaborações em protocolos, verificação e sistemas de agentes.", `hello@zuacaldeira.com`, GitHub, LinkedIn and CV | |
| SHELL-08 | the phone's menu is open | it is read | it lists the four navigation links and the contact link, each at least 44 px high, translated; Escape or the close button closes it and focus returns to the menu button | |
| SHELL-09 | the 404 page at `/fr/home` | it is read | the header and footer are English, and `EN`, `DE`, `PT` lead to the three home pages; none is marked current | |
| SHELL-10 | a keyboard user on `/de/home` | they press Tab once | focus lands on "Zum Hauptinhalt springen", visibly, and following it moves to `<main>` | |
| SHELL-11 | the built `/de/home` | the main navigation is read | it reads Software, Forschung, Texte, Über mich, to `/de/software`, `/de/research`, `/de/writing`, `/de/about`; no link drops the language prefix (waits for the Software and Texte pages) | |

## Diagram: SHELL-02 (acceptance, at build time)

```mermaid
sequenceDiagram
    autonumber
    actor Test as Acceptance test
    participant Build as Angular build (prerender)
    participant DE as dist/.../de/research/index.html
    participant PT as dist/.../pt/research/index.html

    Test->>Build: When the site is built
    Build->>DE: prerender /de/research
    Build->>PT: prerender /pt/research
    Test->>DE: Then the PT link has href="/pt/research"
    Test->>PT: And that file exists, with lang="pt"
```

## Diagram: SHELL-04 (links inside the site keep the language)

```mermaid
flowchart LR
    L["I18nService.language()<br/>de"] --> P["pagePath(lang, page)<br/>(de, about) → /de/about"]
    N["ContentService.navItems<br/>page: home, about, research, running, contact"] --> P
    P --> M3["desktop menu (3, 4, 5)"] & M6["phone menu (6)"] & F9["footer (9)"]
    P --> B7["logo + contact button, desktop (7)"] & B8["logo, phone (8)"] & H10["hero buttons (10)"]
    M3 & M6 & F9 & B7 & B8 & H10 --> D[("dist/…/de/home/index.html<br/>a href=/de/about")]
    D -->|"test A reads every a href"| A{"/de/x, x is built,<br/>no trailing slash?"}
    A -->|yes| OK["200 directly (HOME-PAGE-09)"]
    A -.->|"no: /about before this element, P-01..04"| R["red"]
```

Session type. The visitor's projection loses the `moved301` branch: a change of behaviour, not a
refactor.

```
G_pre  = Page → Visitor : links(hrefs) .
         Visitor → Nginx : get(href) .
         Nginx → Visitor : { ok200(page) . end ,
                             moved301(loc) . Visitor → Nginx : get(loc) . Nginx → Visitor : ok200(page) . end }
G_post = Page → Visitor : links(hrefs) . Visitor → Nginx : get(href) . Nginx → Visitor : ok200(page) . end
Visitor ↾ : Page?links . Nginx!get(href) . Nginx?ok200 . end
Page ↾    : Visitor!links(hrefs) . end      (hrefs ⊆ { /lang/x | x is built })
```

| Diagram arrow | Step in G_post | Rows |
|---|---|---|
| `pagePath` → components → `dist` | `Page → Visitor : links` | 1–10 |
| test A reads every `a href` | `links(hrefs)`, hrefs of the form `/lang/x` | A |
| yes → `200` directly | `Nginx → Visitor : ok200` | HOME-PAGE-09 |
| no → red | the forbidden `moved301` branch, hrefs outside the set | P-01 to P-04 |

Test list. Acceptance A (`frontend/acceptance/shell.test.mjs`): every link inside the site on every
built page (the 15, `/` and `/404` as English) keeps its language and is a page of the build. Unit:
1 `pagePath('de', 'about')` → `/de/about`; 2 `pagePath('pt', 'home')` → `/pt/home`; 3 the desktop
menu on a German page links to `/de/home`, `/de/about`, `/de/research`, `/de/running`, without
contact; 4 it follows a change of language; 5 on `/de/about` only About is active; 6 the phone menu
links to `/pt/…`; 7 the desktop logo → `/de/home`, the contact button → `/de/contact`; 8 the phone
logo → `/de/home`; 9 the footer's menu → `/de/…`; 10 the hero's buttons → `/de/about`,
`/de/contact`. Protocol rows, each a link A must refuse: P-01 an old path `/about` (the first red),
P-02 another language `/en/about` on a German page, P-03 a trailing slash `/de/about/`, P-04 a page
not built `/de/software`; P-02 to P-04 each by a declared break in the built
`de/home/index.html`, then restored.

**Done 2026-11-04.** A went red with `en/home → /home`, `en/home → /about`, … on every page
(P-01) and green after the unit tests 1 to 10. The breaks in the built `de/home/index.html`, each
restored to the same file (md5 checked), turned A red with: P-02 `de/home → /en/about`, P-03
`de/home → /de/about/`, P-04 `de/home → /de/software`. Tests 4 and 5 were green on their first
run and shown to bite: test 4 by reading the language once when the menu is made, test 5 by
removing `routerLinkActive`.

Leftovers, not built:
- The desktop menu's `routerLinkActiveOptions` (`exact` for Home) no longer changes anything: with
  it removed, test 5 stayed green, because `/de/home` is no prefix of another page. It can go.
- The phone menu and the footer build the same list (label and link per nav item); a third copy
  would be the moment to share it.
- `zc-sidenav-menu-items.ts` and `footer.ts` were not Prettier-clean before this element (a
  missing trailing comma); left as they were.

## Width of the header

The bar is the tightest part of the page, so these were measured in the mock-up in all three
languages. The real header needs a check at both sides of the CDK `Handset` query.

| Width | Bar |
|-------|-----|
| 390 | mark, `EN DE PT`, theme, menu |
| 768 | mark, four links, `EN DE PT`, contact button, theme (below 980 px the name gives way to the mark) |
| 1280, 1440 | mark and name, four links, `EN DE PT`, contact button, theme |

## In plain words

| ID | English | Deutsch | Português |
|----|---------|---------|-----------|
| SHELL-01 | At the top, EN, DE and PT switch the language; screen readers say each full name, and the current one is underlined. | Oben wechseln EN, DE und PT die Sprache; Vorleseprogramme nennen den vollen Namen, die aktuelle ist unterstrichen. | No topo, EN, DE e PT mudam a língua; os leitores de ecrã dizem o nome completo, e a atual está sublinhada. |
| SHELL-02 | Switching language keeps the visitor on the same page, only in the other language. | Beim Sprachwechsel bleibt man auf derselben Seite, nur in der anderen Sprache. | Ao mudar de língua, o visitante fica na mesma página, só que na outra língua. |
| SHELL-03 | The footer offers the three languages again, written out in full, with the current one marked. | Die Fußzeile bietet die drei Sprachen noch einmal ausgeschrieben an, die aktuelle ist markiert. | O rodapé volta a oferecer as três línguas, escritas por extenso, com a atual assinalada. |
| SHELL-04 | Every link inside the site keeps the visitor in their language and opens the page straight away, with no detour. | Jeder Link innerhalb der Website bleibt in der Sprache des Besuchers und öffnet die Seite direkt, ohne Umweg. | Cada link dentro do site mantém o visitante na sua língua e abre a página logo, sem desvios. |
| SHELL-05 | The contact button at the top is in the page's language and leads to the contact page. | Der Kontakt-Knopf oben steht in der Sprache der Seite und führt zur Kontaktseite. | O botão de contacto no topo está na língua da página e leva à página de contacto. |
| SHELL-06 | On a phone the top bar fits without sideways scrolling, and every button is big enough for a thumb. | Auf dem Handy passt die obere Leiste ohne seitliches Scrollen, und jeder Knopf ist groß genug für den Daumen. | No telemóvel, a barra de cima cabe sem deslizar para o lado, e cada botão tem tamanho para o polegar. |
| SHELL-07 | The footer ends with an invitation to talk, the work Zua is open to, an email address and profile links. | Die Fußzeile endet mit einer Einladung zum Gespräch, der Arbeit, für die Zua offen ist, E-Mail und Profil-Links. | O rodapé termina com um convite para conversar, o trabalho a que o Zua está aberto, um e-mail e links de perfil. |
| SHELL-08 | On a phone the menu lists every link, easy to tap; Escape or its button closes it, and focus returns. | Auf dem Handy zeigt das Menü alle Links, leicht zu tippen; Escape oder der Knopf schließt es, der Fokus kehrt zurück. | No telemóvel, o menu mostra todos os links, fáceis de tocar; fecha com Escape ou o botão, e o foco volta. |
| SHELL-09 | On the "page not found" page, the top and bottom are in English, and the language links lead home. | Auf der Seite „Seite nicht gefunden“ sind Kopf- und Fußzeile englisch, und die Sprachlinks führen zur Startseite. | Na página «página não encontrada», o topo e o rodapé estão em inglês, e os links de língua levam ao início. |
| SHELL-10 | A keyboard user's first press of Tab shows a visible link that jumps straight to the main content. | Beim ersten Druck auf Tab erscheint sichtbar ein Link, der direkt zum Hauptinhalt springt. | Ao premir Tab pela primeira vez, aparece um link visível que salta diretamente para o conteúdo principal. |
| SHELL-11 | The main menu has four translated links, and none of them takes the visitor into another language. | Das Hauptmenü hat vier übersetzte Links, und keiner führt in eine andere Sprache. | O menu principal tem quatro links traduzidos, e nenhum leva o visitante para outra língua. |

## Decisions

- **Frame option A** (2026-11-02): language codes in the bar, at every width.
- **Language names in full appear in the footer** too, as a second way to reach them.
- **"⊥ Kontakt" and "⊥ Contacto"** use today's translated nav words, because "Kontakt
  aufnehmen" does not fit the bar at 768 px.

Agreed with the developer on 2026-11-04, for SHELL-04:

- **Every link inside the site,** not only the menu: the logo, the contact button, the footer and
  the hero's buttons took the same `301`. The v2 menu (Software, Forschung, Texte, Über mich) moves
  to SHELL-11, which waits for its pages.
- **`pagePath(lang, page)`,** a pure function next to `LANGUAGES` in `models/i18n.ts`, makes every
  such link; `NavItem.route: '/about'` becomes `page: 'about'`.
- **`/` and the 404 page are English,** so their links go to `/en/…` (D1 in `home.md`, SHELL-09).
- **No nginx run for this element:** test A shows each link has the form HOME-PAGE-09 already
  answers `200`.
