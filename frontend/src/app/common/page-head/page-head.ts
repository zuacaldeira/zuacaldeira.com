import { Component, input } from '@angular/core';
import { PageHead as PageHeadText } from '../../content/content';

/**
 * A page's head: eyebrow, the page's one `<h1>` and the intro, on the lozenge tile. Shared by the
 * Software, Writing and Research pages, not copied (D13 in docs/examples/writing.md). Nothing goes
 * beside it since the Research wall left (D26 in docs/examples/research.md).
 */
@Component({
  selector: 'app-page-head',
  templateUrl: './page-head.html',
  styleUrl: './page-head.css',
})
export class PageHead {
  readonly head = input.required<PageHeadText>();
}
