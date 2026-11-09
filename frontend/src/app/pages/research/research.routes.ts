import { Routes } from '@angular/router';
// The fetched snapshot's research.json in the build, the test text in the specs (D21 in software.md).
import research from '@page-content/research';
import { RESEARCH_CONTENT, ResearchContent } from '../../content/content';
import { Research } from './research';

/** The Research page with its own text, no other page's (D20 in software.md, RS-PAGE-06). */
export const RESEARCH_ROUTES: Routes = [
  {
    path: '',
    component: Research,
    providers: [{ provide: RESEARCH_CONTENT, useValue: research satisfies ResearchContent }],
  },
];
