-- The agreed Research page in en, de and pt (docs/examples/research.md; copy in
-- docs/mockups/research/research-spec.md). One JSON object per section (D11 in software.md).
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM content_section WHERE page = 'research';

INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'head', 'en', JSON_OBJECT(
        'eyebrow', 'One paper · ICE 2026',
        'heading', 'Research',
        'intro', 'The state space of every well-formed session type forms a lattice. This page is the paper that proves it: what it shows, how it was checked, and the tool behind it.')),
    ('research', 'head', 'de', JSON_OBJECT(
        'eyebrow', 'Ein Paper · ICE 2026',
        'heading', 'Forschung',
        'intro', 'Der Zustandsraum jedes wohlgeformten Session-Typs bildet einen Verband. Diese Seite stellt das Paper vor, das es beweist: was es zeigt, wie es geprüft wurde und das Werkzeug dahinter.')),
    ('research', 'head', 'pt', JSON_OBJECT(
        'eyebrow', 'Um artigo · ICE 2026',
        'heading', 'Investigação',
        'intro', 'O espaço de estados de todo o tipo de sessão bem formado forma um reticulado. Esta página apresenta o artigo que o prova: o que mostra, como foi verificado e a ferramenta por trás dele.'));

-- The wall's words (D2), the ochre key apart from the caption (D17). Its numbers are R2′ counts of lattices.json, written into the sentences,
-- and a test holds them to the data in every language (D9, RS-WALL-06): change both together.
INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'wall', 'en', JSON_OBJECT(
        'label', 'The 74 distinct lattices of the paper’s benchmark protocols at rung R2′, ordered by size; the 47 that are not distributive in ochre.',
        'caption', '74 distinct lattices, drawn from 104 of the paper’s 108 protocols at rung R2′, a finer construction than the paper’s own.',
        'key', 'Ochre: not distributive, 47 of the 74.',
        'hint', 'Point at a tile to name its protocol.')),
    ('research', 'wall', 'de', JSON_OBJECT(
        'label', 'Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′, nach Größe geordnet; die 47 nicht distributiven in Ocker.',
        'caption', '74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf Stufe R2′, einer feineren Konstruktion als der des Papers.',
        'key', 'Ocker: nicht distributiv, 47 der 74.',
        'hint', 'Zeigen Sie auf eine Kachel, um ihr Protokoll zu sehen.')),
    ('research', 'wall', 'pt', JSON_OBJECT(
        'label', 'Os 74 reticulados distintos dos protocolos de referência do artigo no nível R2′, por tamanho; os 47 não distributivos a ocre.',
        'caption', '74 reticulados distintos, desenhados a partir de 104 dos 108 protocolos do artigo no nível R2′, uma construção mais fina do que a do artigo.',
        'key', 'Ocre: não distributivos, 47 dos 74.',
        'hint', 'Aponte para um mosaico para ver o seu protocolo.'));

-- The paper's card (D2): its labels per language; author, venue and abstract written once, the same
-- in every language (R2: the abstract in English everywhere). Title, year, PDF and read label are in
-- shared/paper.
SET @author = 'Alexandre Zua Caldeira';
SET @venue = 'ICE 2026 · International Workshop on Interaction and Concurrency Experience';
SET @abstract = 'We prove that the state space of every well-formed session type, quotiented by strongly connected components, forms a bounded lattice; n-ary parallel composition yields product lattices. Two consequences follow: duality preserves the lattice up to isomorphism, and Gay–Hole width subtyping corresponds to lattice embedding for non-recursive types. We validate this on 108 benchmark protocols across networking, databases, distributed systems, AI, and fault tolerance: all form lattices, 93 distributive, 15 non-distributive. Mechanised in Lean 4 with two independently developed tool implementations.';

INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'paper', 'en', JSON_OBJECT(
        'kind', 'Workshop paper',
        'note', 'Camera-ready · to appear in EPTCS',
        'inEnglish', 'In English (not shown)',
        'abstractLabel', 'Abstract',
        'author', @author, 'venue', @venue, 'abstract', @abstract)),
    ('research', 'paper', 'de', JSON_OBJECT(
        'kind', 'Workshop-Paper',
        'note', 'Druckfassung · erscheint in EPTCS',
        'inEnglish', 'Auf Englisch',
        'abstractLabel', 'Zusammenfassung',
        'author', @author, 'venue', @venue, 'abstract', @abstract)),
    ('research', 'paper', 'pt', JSON_OBJECT(
        'kind', 'Artigo de workshop',
        'note', 'Versão final · a publicar na EPTCS',
        'inEnglish', 'Em inglês',
        'abstractLabel', 'Resumo',
        'author', @author, 'venue', @venue, 'abstract', @abstract));

-- What it proves: its heading; the statements are shared/paper's (D3).
INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'results', 'en', JSON_OBJECT('heading', 'What it proves')),
    ('research', 'results', 'de', JSON_OBJECT('heading', 'Was es beweist')),
    ('research', 'results', 'pt', JSON_OBJECT('heading', 'O que prova'));

-- How it was checked (D2): the paper's own count, its values the same in every language (RS-CHECK-03),
-- then the rung note, which tells the paper's 93 and 15 from the wall's R2′ numbers; those are held to
-- lattices.json by RS-WALL-06 (D9, D16): change both together.
INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'checked', 'en', JSON_OBJECT(
        'heading', 'How it was checked',
        'figures', JSON_ARRAY(
            JSON_OBJECT('value', '108', 'label', 'benchmark protocols, every one a lattice'),
            JSON_OBJECT('value', '93', 'label', 'distributive'),
            JSON_OBJECT('value', '15', 'label', 'not distributive'),
            JSON_OBJECT('value', 'Lean 4', 'label', 'mechanised proof')),
        'rung', 'The 93 and 15 are the paper’s own count over its 108 protocols. The wall draws the same corpus at rung R2′, which keeps the structure of recursive protocols: there 47 of the 74 distinct lattices are not distributive, and 50 of the 104 protocols fall in one of them.')),
    ('research', 'checked', 'de', JSON_OBJECT(
        'heading', 'Wie es geprüft wurde',
        'figures', JSON_ARRAY(
            JSON_OBJECT('value', '108', 'label', 'Benchmark-Protokolle, jedes ein Verband'),
            JSON_OBJECT('value', '93', 'label', 'distributiv'),
            JSON_OBJECT('value', '15', 'label', 'nicht distributiv'),
            JSON_OBJECT('value', 'Lean 4', 'label', 'mechanisierter Beweis')),
        'rung', 'Die 93 und 15 sind die eigene Zählung des Papers über seine 108 Protokolle. Die Wand zeichnet denselben Korpus auf Stufe R2′, die die Struktur rekursiver Protokolle erhält: Dort sind 47 der 74 verschiedenen Verbände nicht distributiv, und 50 der 104 Protokolle fallen in einen davon.')),
    ('research', 'checked', 'pt', JSON_OBJECT(
        'heading', 'Como foi verificado',
        'figures', JSON_ARRAY(
            JSON_OBJECT('value', '108', 'label', 'protocolos de referência, todos reticulados'),
            JSON_OBJECT('value', '93', 'label', 'distributivos'),
            JSON_OBJECT('value', '15', 'label', 'não distributivos'),
            JSON_OBJECT('value', 'Lean 4', 'label', 'prova mecanizada')),
        'rung', 'Os 93 e 15 são a contagem do próprio artigo sobre os seus 108 protocolos. A parede desenha o mesmo corpus no nível R2′, que mantém a estrutura dos protocolos recursivos: aí 47 dos 74 reticulados distintos não são distributivos, e 50 dos 104 protocolos caem num deles.'));

-- The tool (D2): reticulateP in the Software row's shape. Its text is the Software page's
-- reticulateP row's, copied word for word (D6, each page downloads only its own text); RS-TOOL-03
-- holds the two equal: change both together. The link stays inside the site, in the page's language.
INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'tool', 'en', JSON_OBJECT(
        'heading', 'The tool',
        'kicker', 'Verification tool',
        'title', 'reticulateP',
        'text', 'Builds the state space of a session type and checks that it forms a lattice. It turned the ICE 2026 paper’s 108 benchmark protocols into lattices, is one of the paper’s two independent tool implementations, and checks every session type on this site.',
        'stack', 'Python',
        'link', JSON_OBJECT('label', 'reticulateP on the Software page', 'href', '/en/software'))),
    ('research', 'tool', 'de', JSON_OBJECT(
        'heading', 'Das Werkzeug',
        'kicker', 'Verifikationswerkzeug',
        'title', 'reticulateP',
        'text', 'Baut den Zustandsraum eines Session-Typs und prüft, ob er einen Verband bildet. Es hat die 108 Benchmark-Protokolle des ICE-2026-Papers in Verbände übersetzt, ist eine der beiden unabhängigen Werkzeug-Implementierungen des Papers und prüft jeden Session-Typ auf dieser Website.',
        'stack', 'Python',
        'link', JSON_OBJECT('label', 'reticulateP auf der Software-Seite', 'href', '/de/software'))),
    ('research', 'tool', 'pt', JSON_OBJECT(
        'heading', 'A ferramenta',
        'kicker', 'Ferramenta de verificação',
        'title', 'reticulateP',
        'text', 'Constrói o espaço de estados de um tipo de sessão e verifica que forma um reticulado. Transformou em reticulados os 108 protocolos de referência do artigo ICE 2026, é uma das duas implementações independentes do artigo e verifica cada tipo de sessão deste site.',
        'stack', 'Python',
        'link', JSON_OBJECT('label', 'O reticulateP na página de software', 'href', '/pt/software')));

-- More research (D2): the closing row, Earlier papers to the Writing page (the page makes its link,
-- D22) and ResearchGate alone (Q3), the same in every language; it opens in a new tab and says so.
SET @researchGate = JSON_OBJECT('label', 'ResearchGate', 'href', 'https://www.researchgate.net/profile/Alexandre-Caldeira');

INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'more', 'en', JSON_OBJECT(
        'heading', 'More research',
        'earlier', 'Earlier papers (2007–2010)',
        'newTab', 'opens in a new tab',
        'researchGate', CAST(@researchGate AS JSON))),
    ('research', 'more', 'de', JSON_OBJECT(
        'heading', 'Mehr Forschung',
        'earlier', 'Frühere Paper (2007–2010)',
        'newTab', 'öffnet in einem neuen Tab',
        'researchGate', CAST(@researchGate AS JSON))),
    ('research', 'more', 'pt', JSON_OBJECT(
        'heading', 'Mais investigação',
        'earlier', 'Artigos anteriores (2007–2010)',
        'newTab', 'abre num novo separador',
        'researchGate', CAST(@researchGate AS JSON)));
