import { Component, input } from '@angular/core';
import { PageHead as PageHeadText } from '../../content/content';

/**
 * A page's head: eyebrow, the page's one `<h1>` and the intro, on the lozenge tile. Shared by the
 * Software and Writing pages, not copied (D13 in docs/examples/writing.md).
 */
@Component({
  selector: 'app-page-head',
  templateUrl: './page-head.html',
  styleUrl: './page-head.css',
})
export class PageHead {
  readonly head = input.required<PageHeadText>();
}
