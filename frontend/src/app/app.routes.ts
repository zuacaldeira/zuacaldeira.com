import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Language } from './models/i18n';
import { I18nService } from './services/i18n.service';

const pages: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'research', loadComponent: () => import('./pages/research/research').then((m) => m.Research) },
  // 'work' and 'paedagogik' are hidden until their content is fine-tuned. The page
  // components live on under pages/ — restore the routes here and the nav entries in
  // ContentService to bring them back.
  { path: 'running', loadComponent: () => import('./pages/running/running').then((m) => m.Running) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
];

/** The URL prefix decides the language: it sets the translations and `<html lang>`. */
function inLanguage(lang: Language) {
  return () => {
    inject(I18nService).setLanguage(lang);
    inject(DOCUMENT).documentElement.lang = lang;
    return true;
  };
}

export const routes: Routes = [
  { path: '', redirectTo: 'en/home', pathMatch: 'full' },
  ...(['en', 'de', 'pt'] as const).map((lang) => ({
    path: lang,
    canActivate: [inLanguage(lang)],
    children: pages,
  })),
];
