import { Injectable } from '@angular/core';
import {
  NavItem,
  SocialLink,
  PortfolioProject,
  Publication,
  Race,
  Facharbeit,
  Praesentation,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  readonly navItems: readonly NavItem[] = [
    { label: 'Home', route: '/home', icon: 'home' },
    { label: 'About', route: '/about', icon: 'person' },
    { label: 'Research', route: '/research', icon: 'science' },
    { label: 'Work', route: '/work', icon: 'code' },
    { label: 'Pädagogik', route: '/paedagogik', icon: 'school' },
    { label: 'Running', route: '/running', icon: 'directions_run' },
    { label: 'Contact', route: '/contact', icon: 'mail' },
  ];

  readonly socialLinks: readonly SocialLink[] = [
    {
      platform: 'GitHub',
      url: 'https://github.com/zuacaldeira',
      icon: 'code',
      label: 'GitHub Profile',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/zuacaldeira',
      icon: 'work',
      label: 'LinkedIn Profile',
    },
    {
      platform: 'Strava',
      url: 'https://www.strava.com/athletes/zuacaldeira',
      icon: 'directions_run',
      label: 'Strava Profile',
    },
    {
      platform: 'Email',
      url: 'mailto:hello@zuacaldeira.com',
      icon: 'mail',
      label: 'Send Email',
    },
  ];

  readonly projects: readonly PortfolioProject[] = [
    {
      title: 'Casa Azul Website',
      description:
        'Official website for Kita Casa Azul, a bilingual Portuguese-German kindergarten in Berlin. Built with Angular 21, Angular Material, and SSR prerendering.',
      tags: ['Angular', 'Material', 'SSR', 'TypeScript'],
      repoUrl: 'https://github.com/zuacaldeira/ca-website',
      liveUrl: 'https://casa-azul-berlin.de',
    },
    {
      title: 'Kita Dienstplan',
      description:
        'Shift-planning application for the Casa Azul kindergarten team. Angular frontend with Spring Boot backend, featuring dark mode and role-based access.',
      tags: ['Angular', 'Spring Boot', 'Java', 'PostgreSQL'],
      repoUrl: 'https://github.com/zuacaldeira/kita-dienstplan',
    },
    {
      title: 'Embassy of Angola Berlin',
      description:
        'Web presence for the Embassy of Angola in Berlin. Professional informational site serving the Angolan diaspora community in Germany.',
      tags: ['Web Development', 'Angular', 'i18n'],
    },
    {
      title: 'zuacaldeira.com',
      description:
        'This personal website — built with Angular 21, Material 3, SSR prerendering, and deployed on GitHub Pages.',
      tags: ['Angular', 'Material 3', 'SSR', 'GitHub Pages'],
      repoUrl: 'https://github.com/zuacaldeira/zuacaldeira.com',
      liveUrl: 'https://zuacaldeira.com',
    },
  ];

  readonly publications: readonly Publication[] = [
    {
      title: 'Session Types for Functional Multithreading',
      authors: ['Alexandre Caldeira', 'Vasco T. Vasconcelos'],
      venue: 'POPL — ACM SIGPLAN Symposium on Principles of Programming Languages',
      year: 2020,
      abstract:
        'We present a type system for a functional language with multithreading and session-typed communication channels, ensuring communication safety and deadlock freedom.',
      doi: '10.1145/example',
    },
  ];

  readonly races: readonly Race[] = [
    {
      name: 'Berlin Half Marathon',
      date: '2026-04-05',
      distance: '21.1 km',
      location: 'Berlin',
      upcoming: true,
    },
    {
      name: 'Berliner Firmenlauf',
      date: '2026-05-28',
      distance: '5.5 km',
      location: 'Berlin, Tiergarten',
      upcoming: true,
    },
    {
      name: 'Berlin Marathon',
      date: '2026-09-27',
      distance: '42.195 km',
      location: 'Berlin',
      upcoming: true,
    },
    {
      name: 'Silvesterlauf Berlin',
      date: '2025-12-31',
      distance: '10 km',
      location: 'Berlin',
      result: '48:32',
      upcoming: false,
    },
    {
      name: 'Berliner Halbmarathon',
      date: '2025-04-06',
      distance: '21.1 km',
      location: 'Berlin',
      result: '1:52:15',
      upcoming: false,
    },
  ];

  readonly facharbeiten: readonly Facharbeit[] = [
    {
      title: 'Schriftliche Reflexion — Berufliche Identität',
      subject: 'LF1 — Berufliche Identität',
      year: 2025,
      description:
        'Written reflection on professional identity as part of the educator training program.',
      pdfUrl: 'assets/pdfs/reflexion-berufliche-identitaet.pdf',
    },
    {
      title: 'Bronfenbrenner — Lebenswelten und Diversität',
      subject: 'LF3 — Lebenswelten und Diversität',
      year: 2024,
      description:
        'SOL paper on Bronfenbrenner\'s ecological systems theory in the context of diverse living environments.',
      pdfUrl: 'assets/pdfs/bronfenbrenner-lebenswelten.pdf',
    },
    {
      title: 'Filmzusammenfassung — Anthroposophie (V1)',
      subject: 'LF Waldorf — Anthroposophie',
      year: 2025,
      description:
        'Film reflection and summary on anthroposophy in the context of Waldorf pedagogy.',
      pdfUrl: 'assets/pdfs/filmzusammenfassung-anthroposophie-v1.pdf',
    },
    {
      title: 'Filmzusammenfassung — Anthroposophie (V2)',
      subject: 'LF Waldorf — Anthroposophie',
      year: 2025,
      description:
        'Revised film reflection and summary on anthroposophy in the context of Waldorf pedagogy.',
      pdfUrl: 'assets/pdfs/filmzusammenfassung-anthroposophie-v2.pdf',
    },
  ];

  readonly praesentationen: readonly Praesentation[] = [];
}
