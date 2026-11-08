import { Component, inject } from '@angular/core';
import { SessionType } from '../../../common/session-type/session-type';
import { SOFTWARE_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * This site's links protocol as a global type, word for word as checked in the lab
 * (docs/notation/links.global, D5, D29): one line that wraps at spaces, so a copy gives the line.
 * Notation: never translated, never content.
 */
const LINKS_GLOBAL = 'Page -> Visitor : {links: Visitor -> Nginx : {get: Nginx -> Visitor : {ok200: end}}}';

/** "How I work": three steps and one checked global type (software-spec.md, `HowStrip`, D28). */
@Component({
  selector: 'app-how-strip',
  imports: [SessionType],
  templateUrl: './how-strip.html',
  styleUrl: './how-strip.css',
})
export class HowStrip {
  readonly how = inject(SOFTWARE_CONTENT).how[inject(I18nService).language()];
  readonly links = LINKS_GLOBAL;
  /** The step's number as drawn, 01 to 03; the <ol> numbers the steps for screen readers. */
  readonly number = (i: number) => String(i + 1).padStart(2, '0');
}
