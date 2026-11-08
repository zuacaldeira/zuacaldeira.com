import { Routes } from '@angular/router';
// The fetched snapshot's software.json in the build, the test text in the specs (D21).
import software from '@page-content/software';
import { SOFTWARE_CONTENT, SoftwareContent } from '../../content/content';
import { Software } from './software';

/** The Software page with its own text, so no other page downloads it (D20). */
export const SOFTWARE_ROUTES: Routes = [
  {
    path: '',
    component: Software,
    providers: [{ provide: SOFTWARE_CONTENT, useValue: software satisfies SoftwareContent }],
  },
];
