-- Text shared by several pages (D30 in docs/examples/software.md): the paper's labels,
-- HOME-PAPER-09's fields, read by the Software page's band and the Research page, the home band later.
-- `statements` holds the paper's four, in the research spec's order (D3 in docs/examples/research.md,
-- which replaces D31), written once: notation is the same in every language.
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM content_section WHERE page = 'shared';

-- A user variable keeps JSON as text, so it is cast back to JSON where it is used.
SET @statements = JSON_ARRAY(
    JSON_OBJECT('kind', 'theorem', 'number', 15, 'name', 'Reticulate Theorem',
        'text', 'For every well-formed session type S, ℒ(S)/≡ is a bounded lattice.'),
    JSON_OBJECT('kind', 'definition', 'number', 6, 'name', 'SCC quotient',
        'text', 'The SCC quotient ℒ(S)/≡ identifies mutually reachable states, collapsing each recursion cycle to one class. It is ordered by [s₁] ≤ [s₂] iff s₂ ↠ s₁: a state is smaller when less of the protocol remains, so execution descends from q⊤ to q⊥.'),
    JSON_OBJECT('kind', 'lemma', 'number', 8, 'name', 'End',
        'text', 'ℒ(end)/≡ is a bounded lattice.'),
    JSON_OBJECT('kind', 'proposition', 'number', 18, 'name', 'Duality isomorphism',
        'text', 'For every well-formed session type S, there is a bounded-lattice isomorphism ℒ(S)/≡ ≅ ℒ(dual(S))/≡.'));

INSERT INTO content_section (page, section, lang, body) VALUES
    ('shared', 'paper', 'en', JSON_OBJECT(
        'eyebrow', 'From the paper',
        'paperTitle', 'Session Type State Spaces Form Lattices',
        'year', 2026,
        'theorem', 'Theorem', 'definition', 'Definition', 'lemma', 'Lemma', 'proposition', 'Proposition',
        'evidence', 'Checked on 108 benchmark protocols from networking, databases, distributed systems and AI. Mechanised in Lean 4, with two independent tool implementations.',
        'read', 'Read the paper (PDF)',
        'allResearch', 'All research',
        'more', 'Definition 6, Lemma 8, Proposition 18',
        'pdfUrl', '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf',
        'statements', CAST(@statements AS JSON))),
    ('shared', 'paper', 'de', JSON_OBJECT(
        'eyebrow', 'Aus dem Paper',
        'paperTitle', 'Session Type State Spaces Form Lattices',
        'year', 2026,
        'theorem', 'Satz', 'definition', 'Definition', 'lemma', 'Lemma', 'proposition', 'Proposition',
        'evidence', 'Geprüft an 108 Benchmark-Protokollen aus Netzwerken, Datenbanken, verteilten Systemen und KI. In Lean 4 mechanisiert, mit zwei unabhängigen Werkzeug-Implementierungen.',
        'read', 'Paper lesen (PDF)',
        'allResearch', 'Zur Forschung',
        'more', 'Definition 6, Lemma 8, Proposition 18',
        'pdfUrl', '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf',
        'statements', CAST(@statements AS JSON))),
    ('shared', 'paper', 'pt', JSON_OBJECT(
        'eyebrow', 'Do artigo',
        'paperTitle', 'Session Type State Spaces Form Lattices',
        'year', 2026,
        'theorem', 'Teorema', 'definition', 'Definição', 'lemma', 'Lema', 'proposition', 'Proposição',
        'evidence', 'Verificado em 108 protocolos de referência de redes, bases de dados, sistemas distribuídos e IA. Mecanizado em Lean 4, com duas implementações independentes.',
        'read', 'Ler o artigo (PDF)',
        'allResearch', 'Toda a investigação',
        'more', 'Definição 6, Lema 8, Proposição 18',
        'pdfUrl', '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf',
        'statements', CAST(@statements AS JSON)));
