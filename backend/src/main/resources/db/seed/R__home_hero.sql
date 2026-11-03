-- The agreed home hero in en, de and pt (docs/examples/home.md: HOME-HERO-01, 03, 05, 08; D23).
-- Repeatable and only in the seed profile: the build's database is thrown away after each build.
DELETE FROM home_hero;

INSERT INTO home_hero
    (lang, headline, lede, work_cta, cv_cta, paper_cta, lattice_label, lattice_caption)
VALUES
    ('en',
     'I build software, and prove its protocols hold.',
     'Alexandre Zua Caldeira. Software engineer in Berlin since 2011 and programming-languages researcher (POPL 2010, ICE 2026). Java backends, verification tooling, and AI agents held to a checked protocol.',
     'See selected work',
     'Download CV',
     'Read the ICE 2026 paper →',
     'The lattice 2 to the third: software, research and running in parallel.',
     '2³ · three threads in parallel · the atoms are links'),
    ('de',
     'Ich baue Software und beweise, dass ihre Protokolle halten.',
     'Alexandre Zua Caldeira. Softwareentwickler in Berlin seit 2011 und Forscher im Bereich Programmiersprachen (POPL 2010, ICE 2026). Java-Backends, Verifikationswerkzeuge und KI-Agenten, die an ein geprüftes Protokoll gebunden sind.',
     'Ausgewählte Arbeiten',
     'Lebenslauf herunterladen',
     'ICE-2026-Paper lesen →',
     'Der Verband 2 hoch 3: Software, Forschung und Laufen parallel.',
     '2³ · drei Fäden parallel · die Atome sind Links'),
    ('pt',
     'Construo software e provo que os seus protocolos se cumprem.',
     'Alexandre Zua Caldeira. Engenheiro de software em Berlim desde 2011 e investigador em linguagens de programação (POPL 2010, ICE 2026). Backends Java, ferramentas de verificação e agentes de IA sujeitos a um protocolo verificado.',
     'Ver trabalhos selecionados',
     'Descarregar CV',
     'Ler o artigo ICE 2026 →',
     'O reticulado 2 ao cubo: software, investigação e corrida em paralelo.',
     '2³ · três fios em paralelo · os átomos são ligações');
