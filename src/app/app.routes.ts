import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'research', loadComponent: () => import('./pages/research/research').then((m) => m.Research) },
  // 'work' and 'paedagogik' are hidden until their content is fine-tuned. The page
  // components live on under pages/ — restore the routes here and the nav entries in
  // ContentService to bring them back.
  { path: 'running', loadComponent: () => import('./pages/running/running').then((m) => m.Running) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
];
