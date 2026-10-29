import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateChildFn, Routes } from '@angular/router';
import { Language } from './models/i18n';
import { I18nService } from './services/i18n.service';

const loadHome = () => import('./pages/home/home').then((m) => m.Home);

const pages: Routes = [
  { path: 'home', loadComponent: loadHome },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'research', loadComponent: () => import('./pages/research/research').then((m) => m.Research) },
  // 'work' and 'paedagogik' are hidden until their content is fine-tuned. The page
  // components live on under pages/ — restore the routes here and the nav entries in
  // ContentService to bring them back.
  { path: 'running', loadComponent: () => import('./pages/running/running').then((m) => m.Running) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
];

const SITE_LANGUAGES = ['en', 'de', 'pt'] as const;
const SITE_URL = 'https://zuacaldeira.com';

/**
 * The URL prefix decides the language: it sets the translations and `<html lang>`, and
 * links the page to its version in every language (`hreflang`, English as x-default).
 */
function inLanguage(lang: Language): CanActivateChildFn {
  return (_route, state) => showInLanguage(lang, state.url.slice(lang.length + 1));
}

function showInLanguage(lang: Language, page: string): true {
  inject(I18nService).setLanguage(lang);
  const document = inject(DOCUMENT);
  document.documentElement.lang = lang;

  document.head.querySelectorAll('link[rel="alternate"]').forEach((link) => link.remove());
  for (const [hreflang, prefix] of [...SITE_LANGUAGES.map((l) => [l, l]), ['x-default', 'en']]) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = `${SITE_URL}/${prefix}${page}`;
    document.head.appendChild(link);
  }
  return true;
}

export const routes: Routes = [
  // The site root is the English home itself, not a redirect (D1).
  {
    path: '',
    pathMatch: 'full',
    canActivate: [() => showInLanguage('en', '/home')],
    loadComponent: loadHome,
  },
  ...SITE_LANGUAGES.map((lang) => ({
    path: lang,
    canActivateChild: [inLanguage(lang)],
    children: pages,
  })),
];
