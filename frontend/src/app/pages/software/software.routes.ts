import { Routes } from '@angular/router';
// The fetched snapshot's software.json and shared.json in the build, the test text in the specs (D21).
import software from '@page-content/software';
import shared from '@page-content/shared';
import { SHARED_CONTENT, SharedContent, SOFTWARE_CONTENT, SoftwareContent } from '../../content/content';
import { Software } from './software';

/** The Software page with its own text and the shared text its band reads, no other page's (D20, D30). */
export const SOFTWARE_ROUTES: Routes = [
  {
    path: '',
    component: Software,
    providers: [
      { provide: SOFTWARE_CONTENT, useValue: software satisfies SoftwareContent },
      { provide: SHARED_CONTENT, useValue: shared satisfies SharedContent },
    ],
  },
];
