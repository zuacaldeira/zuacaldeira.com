import { Routes } from '@angular/router';
// The fetched snapshot's home.json in the build, the test text in the specs (D21).
import home from '@page-content/home';
import { HOME_CONTENT, HomeContent } from '../../content/content';
import { Home } from './home';

/** The home page with its own text, so no other page downloads it (D20). */
export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: Home,
    providers: [{ provide: HOME_CONTENT, useValue: home satisfies HomeContent }],
  },
];
