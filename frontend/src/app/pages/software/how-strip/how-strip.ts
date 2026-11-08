import { Component, inject } from '@angular/core';
import { SOFTWARE_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/** "How I work": three steps and one checked global type (software-spec.md, `HowStrip`, D28). */
@Component({
  selector: 'app-how-strip',
  templateUrl: './how-strip.html',
  styleUrl: './how-strip.css',
})
export class HowStrip {
  readonly how = inject(SOFTWARE_CONTENT).how[inject(I18nService).language()];
  /** The step's number as drawn, 01 to 03; the <ol> numbers the steps for screen readers. */
  readonly number = (i: number) => String(i + 1).padStart(2, '0');
}
