import { Routes } from '@angular/router';
// The fetched snapshot's writing.json in the build, the test text in the specs (D21 in software.md).
import writing from '@page-content/writing';
import { WRITING_CONTENT, WritingContent } from '../../content/content';
import { Writing } from './writing';

/** The Writing page with its own text, no other page's (D20 in software.md, WR-PAGE-10). */
export const WRITING_ROUTES: Routes = [
  {
    path: '',
    component: Writing,
    providers: [{ provide: WRITING_CONTENT, useValue: writing satisfies WritingContent }],
  },
];
