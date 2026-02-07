import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'research', loadComponent: () => import('./pages/research/research').then((m) => m.Research) },
  { path: 'work', loadComponent: () => import('./pages/work/work').then((m) => m.Work) },
  { path: 'paedagogik', loadComponent: () => import('./pages/paedagogik/paedagogik').then((m) => m.Paedagogik) },
  { path: 'running', loadComponent: () => import('./pages/running/running').then((m) => m.Running) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
];
