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
        'intro', 'Software que construí, e como o prendo ao seu protocolo: primeiro escrito, depois verificado, depois construído com os testes primeiro.')),
    ('software', 'lead', 'en', JSON_OBJECT(
        'kicker', 'Case study · AI agents',
        'title', 'A monitor that holds a coding agent to its TDD protocol',
        'status', 'In use on this site since November 2026',
        'labels', JSON_OBJECT(
            'question', 'The question',
            'built', 'What I built',
            'protocol', 'The protocol behind it',
            'live', 'The live view',
            'result', 'The result',
            'stack', 'Stack'),
        'question', 'Does a session type make an AI coding agent’s test-driven work better, and in which mode: in pair with the developer, or in batch on an agreed test list? Better means tests that are meaningful for the work, not coverage.',
        'built', 'A monitor that watches a TDD agent as it works, through the agent’s hooks, and checks every step against a session type of the TDD workflow: write a test, run it, see it fail for the right reason, make it pass, refactor, commit. Where a type is given, it refuses a step the type does not allow; otherwise it only observes.',
        'built2', 'It also reports which parts of the target’s own session types the agent’s tests reach: what the software under test must do, failure paths included.',
        'protocol', 'What the agent does (`&{…}`) is kept apart from the results it receives (`+{…}`). The full workflow type has 56 states and 89 transitions and is a lattice, checked with reticulateP. The variants for sabotage (breaking the code on purpose to show a test bites) and for triangulation are subtypes of it.',
        'runCaption', 'A line of the workflow type, word for word.',
        'live', '`reticulab serve`, a small read-only web app, follows each session live: what is being built, in plain sentences; the agreed test list, N of M done; the target’s coverage; where the agent is in its type; and a slider to replay the steps.',
        'result', 'In use on this site since November 2026: every element of its header and footer was built test-first by an agent under the monitor, in pair with me.',
        'stack', 'Python · pytest · Hypothesis · Server-Sent Events · reticulateP',
        'figure', 'The Run step: one action of the agent, three results it receives.',
        'shotAlt', 'The monitor’s live view while the agent built this site’s redirects for old links: on the left, what is being built, in plain sentences, each marked “passed at once” or “failed first, then passed”; on the right, the agent’s map of its 56-state type, at its end.',
        'shotCaption', 'The live view while the agent built this site’s redirects for old links.')),
    ('software', 'lead', 'de', JSON_OBJECT(
        'kicker', 'Fallstudie · KI-Agenten',
        'title', 'Ein Monitor, der einen Coding-Agenten an sein TDD-Protokoll bindet',
        'status', 'Auf dieser Website im Einsatz seit November 2026',
        'labels', JSON_OBJECT(
            'question', 'Die Frage',
            'built', 'Was ich gebaut habe',
            'protocol', 'Das Protokoll dahinter',
            'live', 'Die Live-Ansicht',
            'result', 'Das Ergebnis',
            'stack', 'Stack'),
        'question', 'Macht ein Session-Typ die testgetriebene Arbeit eines KI-Coding-Agenten besser, und in welchem Modus: im Pair mit dem Entwickler oder im Batch auf einer vereinbarten Testliste? Besser heißt: Tests, die für die Arbeit Bedeutung haben, nicht Abdeckung.',
        'built', 'Ein Monitor, der einem TDD-Agenten über dessen Hooks bei der Arbeit zusieht und jeden Schritt gegen einen Session-Typ des TDD-Ablaufs prüft: Test schreiben, ausführen, aus dem richtigen Grund scheitern sehen, grün machen, refaktorisieren, committen. Ist ein Typ vorgegeben, verweigert er jeden Schritt, den der Typ nicht erlaubt; sonst beobachtet er nur.',
        'built2', 'Er zeigt auch, welche Teile der Session-Typen des Ziels die Tests des Agenten erreichen: was die getestete Software tun muss, Fehlerpfade eingeschlossen.',
        'protocol', 'Was der Agent tut (`&{…}`), ist getrennt von den Ergebnissen, die er erhält (`+{…}`). Der vollständige Ablauftyp hat 56 Zustände und 89 Übergänge und ist ein Verband, geprüft mit reticulateP. Die Varianten für Sabotage (den Code absichtlich brechen, um zu zeigen, dass ein Test greift) und für Triangulation sind Subtypen davon.',
        'runCaption', 'Eine Zeile des Ablauftyps, wörtlich.',
        'live', '`reticulab serve`, eine kleine Web-App nur zum Lesen, folgt jeder Sitzung live: was gerade gebaut wird, in einfachen Sätzen; die vereinbarte Testliste, N von M erledigt; die Abdeckung des Ziels; wo der Agent in seinem Typ steht; und ein Regler, der die Schritte noch einmal abspielt.',
        'result', 'Auf dieser Website im Einsatz seit November 2026: Jedes Element ihres Kopf- und Fußbereichs hat ein Agent unter dem Monitor testgetrieben gebaut, im Pair mit mir.',
        'stack', 'Python · pytest · Hypothesis · Server-Sent Events · reticulateP',
        'figure', 'Der Schritt Run: eine Aktion des Agenten, drei Ergebnisse, die er erhält.',
        'shotAlt', 'Die Live-Ansicht des Monitors, während der Agent die Weiterleitungen alter Links dieser Website baute: links, was gebaut wird, in einfachen Sätzen, jeweils als „sofort bestanden“ oder „erst gescheitert, dann bestanden“ markiert; rechts die Karte des Agenten in seinem Typ mit 56 Zuständen, an dessen Ende.',
        'shotCaption', 'Die Live-Ansicht, während der Agent die Weiterleitungen alter Links dieser Website baute.')),
    ('software', 'lead', 'pt', JSON_OBJECT(
        'kicker', 'Estudo de caso · agentes de IA',
        'title', 'Um monitor que prende um agente de programação ao seu protocolo de TDD',
        'status', 'Em uso neste site desde novembro de 2026',
        'labels', JSON_OBJECT(
            'question', 'A pergunta',
            'built', 'O que construí',
            'protocol', 'O protocolo por trás',
            'live', 'A vista ao vivo',
            'result', 'O resultado',
            'stack', 'Tecnologias'),
        'question', 'Um tipo de sessão torna melhor o trabalho guiado por testes de um agente de programação de IA, e em que modo: em par com o programador, ou em lote, sobre uma lista de testes acordada? Melhor quer dizer testes com significado para o trabalho, não cobertura.',
        'built', 'Um monitor que observa um agente de TDD enquanto trabalha, através dos hooks do agente, e verifica cada passo contra um tipo de sessão do fluxo de TDD: escrever um teste, corrê-lo, vê-lo falhar pela razão certa, pô-lo a passar, refatorar, fazer commit. Quando há um tipo dado, recusa qualquer passo que o tipo não permita; caso contrário, apenas observa.',
        'built2', 'Mostra também que partes dos tipos de sessão do próprio alvo os testes do agente alcançam: o que o software em teste tem de fazer, incluindo os caminhos de falha.',
        'protocol', 'O que o agente faz (`&{…}`) fica separado dos resultados que recebe (`+{…}`). O tipo completo do fluxo tem 56 estados e 89 transições e é um reticulado, verificado com o reticulateP. As variantes para sabotagem (partir o código de propósito para mostrar que um teste deteta a falha) e para triangulação são subtipos dele.',
        'runCaption', 'Uma linha do tipo do fluxo, palavra por palavra.',
        'live', '`reticulab serve`, uma pequena aplicação web só de leitura, acompanha cada sessão ao vivo: o que está a ser construído, em frases simples; a lista de testes acordada, N de M feitos; a cobertura do alvo; onde o agente está no seu tipo; e um cursor para rever os passos.',
        'result', 'Em uso neste site desde novembro de 2026: cada elemento do seu cabeçalho e rodapé foi construído com os testes primeiro por um agente sob o monitor, em par comigo.',
        'stack', 'Python · pytest · Hypothesis · Server-Sent Events · reticulateP',
        'figure', 'O passo Run: uma ação do agente, três resultados que recebe.',
        'shotAlt', 'A vista ao vivo do monitor enquanto o agente construía os redirecionamentos de ligações antigas deste site: à esquerda, o que está a ser construído, em frases simples, cada uma marcada como «passou à primeira» ou «falhou primeiro, depois passou»; à direita, o mapa do agente no seu tipo de 56 estados, no fim.',
        'shotCaption', 'A vista ao vivo enquanto o agente construía os redirecionamentos de ligações antigas deste site.'));
