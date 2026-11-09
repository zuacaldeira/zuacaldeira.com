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

-- The wall's words (D2). Its numbers are R2′ counts of lattices.json, written into the sentences,
-- and a test holds them to the data in every language (D9, RS-WALL-06): change both together.
INSERT INTO content_section (page, section, lang, body) VALUES
    ('research', 'wall', 'en', JSON_OBJECT(
        'label', 'The 74 distinct lattices of the paper’s benchmark protocols at rung R2′, ordered by size; the 47 that are not distributive in ochre.',
        'caption', '74 distinct lattices, drawn from 104 of the paper’s 108 protocols at rung R2′, a finer construction than the paper’s own. Ochre: not distributive, 47 of the 74.',
        'hint', 'Point at a tile to name its protocol.')),
    ('research', 'wall', 'de', JSON_OBJECT(
        'label', 'Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′, nach Größe geordnet; die 47 nicht distributiven in Ocker.',
        'caption', '74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf Stufe R2′, einer feineren Konstruktion als der des Papers. Ocker: nicht distributiv, 47 der 74.',
        'hint', 'Zeigen Sie auf eine Kachel, um ihr Protokoll zu sehen.')),
    ('research', 'wall', 'pt', JSON_OBJECT(
        'label', 'Os 74 reticulados distintos dos protocolos de referência do artigo no nível R2′, por tamanho; os 47 não distributivos a ocre.',
        'caption', '74 reticulados distintos, desenhados a partir de 104 dos 108 protocolos do artigo no nível R2′, uma construção mais fina do que a do artigo. Ocre: não distributivos, 47 dos 74.',
        'hint', 'Aponte para um mosaico para ver o seu protocolo.'));
