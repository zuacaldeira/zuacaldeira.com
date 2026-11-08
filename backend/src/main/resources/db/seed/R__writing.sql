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

-- The four texts, newest first (D3), written once: titles, authors, venues, years and targets are the
-- same in every language; only the labels and the ICE note are translated (D11, D15). A user
-- variable keeps JSON as text, so each is cast back to JSON where it is used.
SET @ice2026 = JSON_OBJECT('id', 'ice2026', 'year', 2026, 'kind', 'workshop',
    'title', 'Session Type State Spaces Form Lattices',
    'authors', JSON_ARRAY(JSON_OBJECT('name', 'Alexandre Zua Caldeira', 'self', CAST('true' AS JSON))),
    'venue', 'ICE 2026 · International Workshop on Interaction and Concurrency Experience',
    'href', '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf',
    'external', CAST('false' AS JSON));
SET @popl2010 = JSON_OBJECT('id', 'popl2010', 'year', 2010, 'kind', 'conference',
    'title', 'Modular Session Types for Distributed Object-Oriented Programming',
    'authors', JSON_ARRAY(JSON_OBJECT('name', 'Simon J. Gay'), JSON_OBJECT('name', 'Vasco T. Vasconcelos'),
        JSON_OBJECT('name', 'António Ravara'), JSON_OBJECT('name', 'Nils Gesbert'),
        JSON_OBJECT('name', 'Alexandre Z. Caldeira', 'self', CAST('true' AS JSON))),
    'venue', 'POPL 2010 · ACM SIGPLAN Symposium on Principles of Programming Languages',
    'href', 'https://doi.org/10.1145/1706299.1706335', 'label', 'ACM Digital Library (DOI)',
    'external', CAST('true' AS JSON));
SET @fool2009 = JSON_OBJECT('id', 'fool2009', 'year', 2009, 'kind', 'workshop',
    'title', 'Dynamic Interfaces',
    'authors', JSON_ARRAY(JSON_OBJECT('name', 'Vasco T. Vasconcelos'), JSON_OBJECT('name', 'Simon J. Gay'),
        JSON_OBJECT('name', 'António Ravara'), JSON_OBJECT('name', 'Nils Gesbert'),
        JSON_OBJECT('name', 'Alexandre Z. Caldeira', 'self', CAST('true' AS JSON))),
    'venue', 'FOOL 2009 · International Workshop on Foundations of Object-Oriented Languages',
    'href', 'https://eprints.gla.ac.uk/47911/', 'label', 'eprints.gla.ac.uk',
    'external', CAST('true' AS JSON));
SET @congu2007 = JSON_OBJECT('id', 'congu2007', 'year', 2007, 'kind', 'report',
    'title', 'ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications',
    'authors', JSON_ARRAY(JSON_OBJECT('name', 'João Abreu'),
        JSON_OBJECT('name', 'Alexandre Caldeira', 'self', CAST('true' AS JSON)),
        JSON_OBJECT('name', 'Antónia Lopes'), JSON_OBJECT('name', 'Isabel Nunes'),
        JSON_OBJECT('name', 'Luís S. Reis'), JSON_OBJECT('name', 'Vasco T. Vasconcelos')),
    'venue', 'DI/FCUL TR-07-7 · Department of Informatics, University of Lisbon',
    'href', 'https://repositorio.ulisboa.pt/handle/10451/14164', 'label', 'repositorio.ulisboa.pt',
    'external', CAST('true' AS JSON));

INSERT INTO content_section (page, section, lang, body) VALUES
    ('writing', 'texts', 'en', JSON_OBJECT(
        'inEnglish', 'In English',
        'read', 'Read (PDF)',
        'newTab', 'opens in a new tab',
        'kinds', JSON_OBJECT('workshop', 'Workshop paper', 'conference', 'Conference paper',
            'report', 'Technical report'),
        'items', JSON_ARRAY(JSON_SET(@ice2026, '$.note', 'Camera-ready · to appear in EPTCS'),
            CAST(@popl2010 AS JSON), CAST(@fool2009 AS JSON), CAST(@congu2007 AS JSON)))),
    ('writing', 'texts', 'de', JSON_OBJECT(
        'inEnglish', 'Auf Englisch',
        'read', 'Lesen (PDF)',
        'newTab', 'öffnet in einem neuen Tab',
        'kinds', JSON_OBJECT('workshop', 'Workshop-Paper', 'conference', 'Konferenz-Paper',
            'report', 'Technischer Bericht'),
        'items', JSON_ARRAY(JSON_SET(@ice2026, '$.note', 'Druckfassung · erscheint in EPTCS'),
            CAST(@popl2010 AS JSON), CAST(@fool2009 AS JSON), CAST(@congu2007 AS JSON)))),
    ('writing', 'texts', 'pt', JSON_OBJECT(
        'inEnglish', 'Em inglês',
        'read', 'Ler (PDF)',
        'newTab', 'abre num novo separador',
        'kinds', JSON_OBJECT('workshop', 'Artigo de workshop', 'conference', 'Artigo de conferência',
            'report', 'Relatório técnico'),
        'items', JSON_ARRAY(JSON_SET(@ice2026, '$.note', 'Versão final · a publicar na EPTCS'),
            CAST(@popl2010 AS JSON), CAST(@fool2009 AS JSON), CAST(@congu2007 AS JSON))));
