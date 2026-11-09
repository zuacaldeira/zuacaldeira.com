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
