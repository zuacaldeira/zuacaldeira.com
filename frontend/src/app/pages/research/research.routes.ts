import { Routes } from '@angular/router';
// The fetched snapshot's research.json and shared.json in the build, the test text in the specs (D21
// in software.md).
import research from '@page-content/research';
import shared from '@page-content/shared';
import { RESEARCH_CONTENT, ResearchContent, SHARED_CONTENT, SharedContent } from '../../content/content';
import { Research } from './research';

/**
 * The Research page with its own text and the paper's shared text, no other page's (D20 in
 * software.md; RS-PAGE-06, D11, D18 in research.md).
 */
export const RESEARCH_ROUTES: Routes = [
  {
    path: '',
    component: Research,
    providers: [
      { provide: RESEARCH_CONTENT, useValue: research satisfies ResearchContent },
      { provide: SHARED_CONTENT, useValue: shared satisfies SharedContent },
    ],
  },
];
