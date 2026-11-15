-- The agreed About page in en, de and pt (docs/examples/about.md; copy in
-- docs/mockups/about/about-spec.md). One JSON object per section (D1 there; D11 in software.md).
-- Only finished text: the chapters (piri, estremoz, lisbon, berlin) come with Zua's words (D2).
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM content_section WHERE page = 'about';

INSERT INTO content_section (page, section, lang, body) VALUES
    ('about', 'head', 'en', JSON_OBJECT(
        'eyebrow', 'Piri → Estremoz → Lisbon → Berlin',
        'heading', 'About',
        'intro', 'My CV, told as a story: four places, what I learned and did in each, and why I moved on.')),
    ('about', 'head', 'de', JSON_OBJECT(
        'eyebrow', 'Piri → Estremoz → Lissabon → Berlin',
        'heading', 'Über mich',
        'intro', 'Mein Lebenslauf als Geschichte: vier Orte, was ich an jedem gelernt und getan habe, und warum ich weitergezogen bin.')),
    ('about', 'head', 'pt', JSON_OBJECT(
        'eyebrow', 'Piri → Estremoz → Lisboa → Berlim',
        'heading', 'Sobre',
        'intro', 'O meu currículo contado como uma história: quatro lugares, o que aprendi e fiz em cada um, e porque segui em frente.'));

-- The route (D10): its labels, {n} and {total} filled in by the page, and the four stops in route
-- order, their ids the same in every language.
INSERT INTO content_section (page, section, lang, body) VALUES
    ('about', 'route', 'en', JSON_OBJECT(
        'label', 'The route',
        'chapter', 'Chapter {n}',
        'chapterOf', 'Chapter {n} of {total}',
        'movedOn', 'Why I moved on',
        'newTab', 'opens in a new tab',
        'stops', JSON_ARRAY(
            JSON_OBJECT('id', 'piri', 'place', 'Piri'),
            JSON_OBJECT('id', 'estremoz', 'place', 'Estremoz'),
            JSON_OBJECT('id', 'lisbon', 'place', 'Lisbon'),
            JSON_OBJECT('id', 'berlin', 'place', 'Berlin')))),
    ('about', 'route', 'de', JSON_OBJECT(
        'label', 'Der Weg',
        'chapter', 'Kapitel {n}',
        'chapterOf', 'Kapitel {n} von {total}',
        'movedOn', 'Warum ich weitergezogen bin',
        'newTab', 'öffnet in einem neuen Tab',
        'stops', JSON_ARRAY(
            JSON_OBJECT('id', 'piri', 'place', 'Piri'),
            JSON_OBJECT('id', 'estremoz', 'place', 'Estremoz'),
            JSON_OBJECT('id', 'lisbon', 'place', 'Lissabon'),
            JSON_OBJECT('id', 'berlin', 'place', 'Berlin')))),
    ('about', 'route', 'pt', JSON_OBJECT(
        'label', 'O percurso',
        'chapter', 'Capítulo {n}',
        'chapterOf', 'Capítulo {n} de {total}',
        'movedOn', 'Porque segui em frente',
        'newTab', 'abre num novo separador',
        'stops', JSON_ARRAY(
            JSON_OBJECT('id', 'piri', 'place', 'Piri'),
            JSON_OBJECT('id', 'estremoz', 'place', 'Estremoz'),
            JSON_OBJECT('id', 'lisbon', 'place', 'Lisboa'),
            JSON_OBJECT('id', 'berlin', 'place', 'Berlim'))));
