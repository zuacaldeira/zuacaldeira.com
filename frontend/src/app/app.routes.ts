import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateChildFn, Routes } from '@angular/router';
import { Language, LANGUAGES } from './models/i18n';
import { I18nService } from './services/i18n.service';

// Pages with text from the content API load it with their route, each only its own (D20, D21).
// Each route has its own inline `import()`: the build maps a route to the chunks it preloads by
// its own call, and a shared loader function left the home routes without a preload.
const loadNotFound = () => import('./pages/not-found/not-found').then((m) => m.NotFound);

const pages: Routes = [
  { path: 'home', loadChildren: () => import('./pages/home/home.routes').then((m) => m.HOME_ROUTES) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  {
    path: 'software',
    loadChildren: () => import('./pages/software/software.routes').then((m) => m.SOFTWARE_ROUTES),
  },
  {
    path: 'research',
    loadChildren: () => import('./pages/research/research.routes').then((m) => m.RESEARCH_ROUTES),
  },
  {
    path: 'writing',
    loadChildren: () => import('./pages/writing/writing.routes').then((m) => m.WRITING_ROUTES),
  },
  // 'work' and 'paedagogik' are hidden until their content is fine-tuned. The page
  // components live on under pages/ — restore the routes here and the nav entries in
  // ContentService to bring them back.
  { path: 'running', loadComponent: () => import('./pages/running/running').then((m) => m.Running) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
];

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
  for (const [hreflang, prefix] of [...LANGUAGES.map((l) => [l, l]), ['x-default', 'en']]) {
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
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  ...LANGUAGES.map((lang) => ({
    path: lang,
    canActivateChild: [inLanguage(lang)],
    children: pages,
  })),
  // The 404 page (D9): prerendered at /404, and shown for every unknown path in the browser,
  // which loads it from nginx's 404.html on such a path (D32).
  { path: '404', loadComponent: loadNotFound },
  { path: '**', loadComponent: loadNotFound },
];
