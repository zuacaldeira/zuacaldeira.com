import { Translations } from '../models/i18n';

export const de: Translations = {
  nav: {
    home: 'Startseite',
    about: 'Über mich',
    research: 'Forschung',
    work: 'Arbeit',
    paedagogik: 'Pädagogik',
    running: 'Laufen',
    contact: 'Kontakt',
  },
  hero: {
    greeting: 'Hallo, ich bin',
    tagline: 'Forscher. Entwickler. Erzieher. Läufer.',
    location: 'Lissabon → Berlin',
    aboutCta: 'Über mich',
    contactCta: 'Kontakt aufnehmen',
  },
  about: {
    title: 'Über mich',
    subtitle: 'Von Lissabon nach Berlin — eine Reise durch Forschung, Code, Bildung und Laufen.',
    journeyHeading: 'Der Weg',
    journeyP1:
      'Ich bin in Lissabon, Portugal, aufgewachsen, wo ich Informatik an der Universität Lissabon studiert habe. Unter der Betreuung von <strong>Vasco T. Vasconcelos</strong> erforschte ich die Welt der <strong>Session Types</strong> — eine Typdisziplin für nebenläufige und verteilte Systeme, die Kommunikationssicherheit durch Konstruktion garantiert.',
    journeyP2:
      'Meine Forschung wurde auf der <strong>POPL</strong> präsentiert, einer der führenden Konferenzen in der Programmiersprachentheorie. Diese Erfahrung hat mein Denken über Software geprägt: Typen als Spezifikationen, Programme als Beweise, Korrektheit durch Design.',
    berlinHeading: 'Berliner Kapitel',
    berlinP1:
      'In Berlin habe ich meinen Software-Engineering-Hintergrund mit einer neuen Berufung verbunden: <strong>frühkindliche Bildung</strong>. Ich absolviere derzeit die Ausbildung zum staatlich anerkannten <em>Erzieher</em> an der <strong>Freien Fachschule Berlin</strong> und entwickle gleichzeitig Software für den zweisprachigen portugiesisch-deutschen Kindergarten <strong>Kita Casa Azul</strong>.',
    berlinP2:
      'Auf der technischen Seite arbeite ich mit <strong>Angular</strong> und <strong>Spring Boot</strong> und entwickle alles von der <strong>Casa Azul Website</strong> bis zur internen <strong>Dienstplan</strong>-Anwendung (Schichtplanung). Außerdem habe ich die Webpräsenz der <strong>Botschaft von Angola in Berlin</strong> entwickelt.',
    beyondHeading: 'Neben der Arbeit',
    beyondP1:
      'Ich bin Hobbyläufer und trainiere durch die Berliner Jahreszeiten. Vom Silvesterlauf bis zum Berlin-Marathon — das Laufen hält mich geerdet und gibt allem anderen Struktur.',
  },
  research: {
    title: 'Forschung',
    subtitle: 'Session Types für sichere nebenläufige Programmierung, unter Vasco T. Vasconcelos.',
    profilesHeading: 'Forschungsprofile',
    abstract:
      'Wir präsentieren ein Typsystem für eine funktionale Sprache mit Multithreading und Session-typisierten Kommunikationskanälen, das Kommunikationssicherheit und Deadlock-Freiheit gewährleistet.',
  },
  work: {
    title: 'Arbeit',
    subtitle: 'Softwareprojekte — Angular, Spring Boot und das Casa-Azul-Ökosystem.',
  },
  paedagogik: {
    title: 'Pädagogik',
    subtitle:
      'Erzieher in Ausbildung an der Freien Fachschule Berlin — Facharbeiten und Präsentationen.',
    intro:
      'Ich absolviere derzeit meine Ausbildung zum staatlich anerkannten Erzieher an der <strong>Freien Fachschule für Sozialpädagogik Berlin</strong>. Unten finden Sie meine Facharbeiten und Präsentationen aus dem Programm.',
    tabFacharbeiten: 'Facharbeiten',
    tabPraesentationen: 'Präsentationen',
  },
  running: {
    title: 'Laufen',
    subtitle: 'Training und Wettkämpfe durch die Berliner Jahreszeiten.',
    upcomingHeading: 'Kommende Rennen',
    completedHeading: 'Abgeschlossen',
    stravaButton: 'Auf Strava folgen',
    upcoming: 'Kommend',
  },
  contact: {
    title: 'Kontakt',
    subtitle: 'Lassen Sie uns vernetzen — kontaktieren Sie mich über einen dieser Kanäle.',
  },
  footer: {
    tagline: 'Forscher. Entwickler. Erzieher. Läufer.',
    pagesHeading: 'Seiten',
    connectHeading: 'Vernetzen',
  },
  common: {
    source: 'Quellcode',
    live: 'Live',
    pdf: 'PDF',
    skipToContent: 'Zum Hauptinhalt springen',
    menu: 'Menü',
    closeMenu: 'Menü schließen',
    openMenu: 'Menü öffnen',
  },
  roleCards: [
    {
      title: 'Forscher',
      description: 'Session Types, POPL, mit Vasco Vasconcelos an der Universität Lissabon.',
    },
    {
      title: 'Entwickler',
      description:
        'Angular + Spring Boot. Entwicklung von Webanwendungen für das Casa-Azul-Ökosystem.',
    },
    {
      title: 'Erzieher',
      description: 'Erzieher in Ausbildung an der Freien Fachschule Berlin.',
    },
    {
      title: 'Läufer',
      description: 'Hobbyläufer, der für Berliner Rennen und Marathons trainiert.',
    },
  ],
  projects: [
    {
      description:
        'Offizielle Website der Kita Casa Azul, ein zweisprachiger portugiesisch-deutscher Kindergarten in Berlin. Entwickelt mit Angular 21, Angular Material und SSR-Prerendering.',
    },
    {
      description:
        'Dienstplan-Anwendung für das Team des Kindergartens Casa Azul. Angular-Frontend mit Spring-Boot-Backend, mit Dunkelmodus und rollenbasiertem Zugriff.',
    },
    {
      description:
        'Webpräsenz der Botschaft von Angola in Berlin. Professionelle Informationsseite für die angolanische Diaspora-Gemeinschaft in Deutschland.',
    },
    {
      description:
        'Diese persönliche Website — entwickelt mit Angular 21, Material 3, SSR-Prerendering und auf GitHub Pages bereitgestellt.',
    },
  ],
  facharbeiten: [
    {
      description:
        'Schriftliche Reflexion über die berufliche Identität als Teil des Erzieher-Ausbildungsprogramms.',
    },
    {
      description:
        'SOL-Arbeit über Bronfenbrenners ökologische Systemtheorie im Kontext vielfältiger Lebenswelten.',
    },
    {
      description:
        'Filmreflexion und Zusammenfassung zur Anthroposophie im Kontext der Waldorfpädagogik.',
    },
    {
      description:
        'Überarbeitete Filmreflexion und Zusammenfassung zur Anthroposophie im Kontext der Waldorfpädagogik.',
    },
  ],
};
