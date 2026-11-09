import { Component, input } from '@angular/core';
import { WorkRow as WorkRowText } from '../../content/content';

/**
 * One piece of work: kicker, name, text, stack and its links (software-spec.md, `WorkRow`). Shared by
 * the Software page's "More work" and the Research page's tool, not copied (D21 in research.md).
 * Names and stacks are never translated.
 */
@Component({
  selector: 'app-work-row',
  templateUrl: './work-row.html',
  styleUrl: './work-row.css',
})
export class WorkRow {
  readonly row = input.required<WorkRowText>();
  /** Outside the site: opened in a new tab, as the footer's links are (D27 in software.md). */
  readonly outside = (href: string) => href.startsWith('https://');
}
