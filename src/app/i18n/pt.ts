import { Translations } from '../models/i18n';

export const pt: Translations = {
  nav: {
    home: 'Início',
    about: 'Sobre',
    research: 'Investigação',
    work: 'Trabalho',
    paedagogik: 'Pedagogia',
    running: 'Corrida',
    contact: 'Contacto',
  },
  hero: {
    greeting: 'Olá, eu sou',
    tagline: 'Investigador. Programador. Educador. Corredor.',
    location: 'Lisboa → Berlim',
    aboutCta: 'Sobre mim',
    contactCta: 'Entrar em contacto',
  },
  about: {
    title: 'Sobre',
    subtitle: 'De Lisboa a Berlim — uma jornada entre investigação, código, educação e corrida.',
    journeyHeading: 'O Percurso',
    journeyP1:
      'Cresci em Lisboa, Portugal, onde estudei Engenharia Informática na Universidade de Lisboa. Sob a orientação de <strong>Vasco T. Vasconcelos</strong>, explorei o mundo dos <strong>Session Types</strong> — uma disciplina de tipos para sistemas concorrentes e distribuídos que garante segurança na comunicação por construção.',
    journeyP2:
      'A minha investigação foi apresentada no <strong>POPL</strong>, um dos principais eventos em teoria de linguagens de programação. Esta experiência moldou a forma como penso sobre software: tipos como especificações, programas como provas, correção por design.',
    berlinHeading: 'Capítulo Berlim',
    berlinP1:
      'Em Berlim, combinei a minha formação em engenharia de software com uma nova vocação: <strong>educação infantil</strong>. Estou atualmente em formação como <em>Erzieher</em> (educador reconhecido pelo estado) na <strong>Freie Fachschule Berlin</strong>, enquanto desenvolvo software para o jardim de infância bilingue português-alemão <strong>Kita Casa Azul</strong>.',
    berlinP2:
      'No lado técnico, trabalho com <strong>Angular</strong> e <strong>Spring Boot</strong>, construindo desde o <strong>Website Casa Azul</strong> até à aplicação interna de <strong>Dienstplan</strong> (planeamento de turnos). Também desenvolvi a presença web da <strong>Embaixada de Angola em Berlim</strong>.',
    beyondHeading: 'Para Além do Trabalho',
    beyondP1:
      'Sou corredor amador, treinando ao longo das estações de Berlim. Do Silvesterlauf à Maratona de Berlim, a corrida mantém-me equilibrado e dá estrutura a tudo o resto.',
  },
  research: {
    title: 'Investigação',
    subtitle: 'Session Types para programação concorrente segura, com Vasco T. Vasconcelos.',
    profilesHeading: 'Perfis de Investigação',
    abstract:
      'Apresentamos um sistema de tipos para uma linguagem funcional com multithreading e canais de comunicação com session types, garantindo segurança na comunicação e ausência de deadlocks.',
  },
  work: {
    title: 'Trabalho',
    subtitle: 'Projetos de software — Angular, Spring Boot e o ecossistema Casa Azul.',
  },
  paedagogik: {
    title: 'Pedagogia',
    subtitle: 'Erzieher em formação na Freie Fachschule Berlin — trabalhos académicos e apresentações.',
    intro:
      'Estou atualmente a completar a minha formação como educador reconhecido pelo estado (<em>Erzieher</em>) na <strong>Freie Fachschule für Sozialpädagogik Berlin</strong>. Abaixo encontram-se os meus trabalhos académicos e apresentações do programa.',
    tabFacharbeiten: 'Facharbeiten',
    tabPraesentationen: 'Präsentationen',
  },
  running: {
    title: 'Corrida',
    subtitle: 'Treino e competição ao longo das estações de Berlim.',
    upcomingHeading: 'Próximas Corridas',
    completedHeading: 'Concluídas',
    stravaButton: 'Seguir no Strava',
    upcoming: 'Próxima',
  },
  contact: {
    title: 'Contacto',
    subtitle: 'Vamos conectar — entre em contacto por qualquer um destes canais.',
  },
  footer: {
    tagline: 'Investigador. Programador. Educador. Corredor.',
    pagesHeading: 'Páginas',
    connectHeading: 'Conectar',
  },
  common: {
    source: 'Código',
    live: 'Online',
    pdf: 'PDF',
    skipToContent: 'Saltar para o conteúdo principal',
    menu: 'Menu',
    closeMenu: 'Fechar menu',
    openMenu: 'Abrir menu',
  },
  roleCards: [
    {
      title: 'Investigador',
      description: 'Session Types, POPL, com Vasco Vasconcelos na Universidade de Lisboa.',
    },
    {
      title: 'Programador',
      description: 'Angular + Spring Boot. A construir aplicações web para o ecossistema Casa Azul.',
    },
    {
      title: 'Educador',
      description: 'Erzieher em formação na Freie Fachschule Berlin.',
    },
    {
      title: 'Corredor',
      description: 'Corredor amador a treinar para corridas e maratonas em Berlim.',
    },
  ],
  projects: [
    {
      description:
        'Website oficial da Kita Casa Azul, um jardim de infância bilingue português-alemão em Berlim. Construído com Angular 21, Angular Material e SSR prerendering.',
    },
    {
      description:
        'Aplicação de planeamento de turnos para a equipa do jardim de infância Casa Azul. Frontend Angular com backend Spring Boot, com modo escuro e acesso baseado em funções.',
    },
    {
      description:
        'Presença web da Embaixada de Angola em Berlim. Site informativo profissional ao serviço da comunidade da diáspora angolana na Alemanha.',
    },
    {
      description:
        'Este website pessoal — construído com Angular 21, Material 3, SSR prerendering e implementado no GitHub Pages.',
    },
  ],
  facharbeiten: [
    {
      description: 'Reflexão escrita sobre identidade profissional como parte do programa de formação de educadores.',
    },
    {
      description:
        'Trabalho SOL sobre a teoria dos sistemas ecológicos de Bronfenbrenner no contexto de ambientes de vida diversos.',
    },
    {
      description: 'Reflexão e resumo de filme sobre antroposofia no contexto da pedagogia Waldorf.',
    },
    {
      description: 'Reflexão e resumo de filme revisado sobre antroposofia no contexto da pedagogia Waldorf.',
    },
  ],
};
