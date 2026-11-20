import { Translations } from '../models/i18n';

export const pt: Translations = {
  nav: {
    home: 'Início',
    // The menu's words, in lower case as the mock-ups write them (D45 in docs/examples/shell.md).
    about: 'sobre',
    software: 'software',
    research: 'investigação',
    writing: 'textos',
    work: 'Trabalho',
    paedagogik: 'Pedagogia',
    running: 'Corrida',
    contact: 'Contacto',
  },
  hero: {
    greeting: 'Olá, eu sou',
    tagline: 'Investigador. Programador. Educador. Corredor.',
    location: 'Piri → Estremoz → Lisboa → Berlim',
    aboutCta: 'Sobre mim',
    contactCta: 'Entrar em contacto',
  },
  work: {
    title: 'Trabalho',
    subtitle: 'Projetos de software — Angular, Spring Boot e o ecossistema Casa Azul.',
  },
  paedagogik: {
    title: 'Pedagogia',
    subtitle:
      'Erzieher em formação na Freie Fachschule Berlin — trabalhos académicos e apresentações.',
    intro:
      'Estou atualmente a completar a minha formação como educador reconhecido pelo estado (<em>Erzieher</em>) na <strong>Freie Fachschule für Sozialpädagogik Berlin</strong>. Abaixo encontram-se os meus trabalhos académicos e apresentações do programa.',
    tabFacharbeiten: 'Facharbeiten',
    tabPraesentationen: 'Präsentationen',
  },
  running: {
    title: 'Corrida',
    subtitle: 'Treino e competição ao longo das estações de Berlim.',
    upcomingHeading: 'Próximas corridas',
    completedHeading: 'Concluídas',
    stravaButton: 'Seguir no Strava',
    upcoming: 'Próxima',
  },
  contact: {
    title: 'Contacto',
    subtitle: 'Fala comigo por qualquer um destes canais.',
  },
  footer: {
    end: 'todo o protocolo acaba aqui',
    heading: 'Vamos falar do teu sistema.',
    availability:
      'Aberto a funções em engenharia de software e investigação, e a colaborações em protocolos, verificação e sistemas de agentes.',
    cv: 'CV (PDF)',
    city: 'Berlim',
  },
  common: {
    source: 'Código',
    live: 'Online',
    pdf: 'PDF',
    skipToContent: 'Saltar para o conteúdo principal',
    menu: 'Menu',
    closeMenu: 'Fechar menu',
    openMenu: 'Abrir menu',
    language: 'Língua',
    mainNav: 'Navegação principal',
    contactCta: 'Contacto',
  },
  notFound: {
    title: 'Página não encontrada',
    text: 'Este caminho acaba no fundo: aqui não há nenhuma página.',
    back: 'Voltar ao início',
  },
  paper: {
    eyebrow: 'Do artigo',
    kinds: { definition: 'Definição', lemma: 'Lema', theorem: 'Teorema', proposition: 'Proposição' },
    read: 'Ler o artigo (PDF)',
  },
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
      description:
        'Reflexão escrita sobre identidade profissional como parte do programa de formação de educadores.',
    },
    {
      description:
        'Trabalho SOL sobre a teoria dos sistemas ecológicos de Bronfenbrenner no contexto de ambientes de vida diversos.',
    },
    {
      description:
        'Reflexão e resumo de filme sobre antroposofia no contexto da pedagogia Waldorf.',
    },
    {
      description:
        'Reflexão e resumo de filme revisado sobre antroposofia no contexto da pedagogia Waldorf.',
    },
  ],
};
