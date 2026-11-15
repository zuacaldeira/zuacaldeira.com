import { Routes } from '@angular/router';
// The fetched snapshot's about.json in the build, the test text in the specs (D21 in software.md).
import about from '@page-content/about';
import { ABOUT_CONTENT, AboutContent } from '../../content/content';
import { About } from './about';

/** The About page with its own text, no other page's (D20 in software.md; ABOUT-06 in about.md). */
export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: About,
    providers: [{ provide: ABOUT_CONTENT, useValue: about satisfies AboutContent }],
  },
];
