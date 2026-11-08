-- The agreed Writing page in en, de and pt (docs/examples/writing.md; copy in
-- docs/mockups/writing/writing-spec.md). One JSON object per section (D11 in software.md).
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM content_section WHERE page = 'writing';

INSERT INTO content_section (page, section, lang, body) VALUES
    ('writing', 'head', 'en', JSON_OBJECT(
        'eyebrow', 'Published work',
        'heading', 'Writing',
        'intro', 'Papers on session types, and on tools that check code against its specification, newest first. Each one links to where the text lives.')),
    ('writing', 'head', 'de', JSON_OBJECT(
        'eyebrow', 'Veröffentlichungen',
        'heading', 'Texte',
        'intro', 'Paper über Session-Typen und über Werkzeuge, die Code gegen seine Spezifikation prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, wo der Text liegt.')),
    ('writing', 'head', 'pt', JSON_OBJECT(
        'eyebrow', 'Publicações',
        'heading', 'Textos',
        'intro', 'Artigos sobre tipos de sessão e sobre ferramentas que verificam o código face à sua especificação, os mais recentes primeiro. Cada um leva ao sítio onde o texto está.'));
