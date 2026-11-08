-- The agreed Software page in en, de and pt (docs/examples/software.md; copy in
-- docs/mockups/software/software-spec.md). One JSON object per section (D11).
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM content_section WHERE page = 'software';

INSERT INTO content_section (page, section, lang, body) VALUES
    ('software', 'head', 'en', JSON_OBJECT(
        'eyebrow', 'Selected work',
        'heading', 'Software',
        'intro', 'Software I have built, and how I hold it to its protocol: written down first, checked, then built test-first.')),
    ('software', 'head', 'de', JSON_OBJECT(
        'eyebrow', 'Ausgewählte Arbeiten',
        'heading', 'Software',
        'intro', 'Software, die ich gebaut habe, und wie ich sie an ihr Protokoll binde: zuerst aufgeschrieben, geprüft, dann testgetrieben gebaut.')),
    ('software', 'head', 'pt', JSON_OBJECT(
        'eyebrow', 'Trabalhos selecionados',
        'heading', 'Software',
        'intro', 'Software que construí, e como o prendo ao seu protocolo: primeiro escrito, depois verificado, depois construído com os testes primeiro.'));
