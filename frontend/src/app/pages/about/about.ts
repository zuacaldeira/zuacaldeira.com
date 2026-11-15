import { Component, inject } from '@angular/core';
import { ABOUT_CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';

/**
 * The About page: Zua's CV told as a story along the route (docs/examples/about.md; build spec
 * docs/mockups/about/about-spec.md). Its head is the shared head, as on Software, Writing and
 * Research.
 */
@Component({
  selector: 'app-about',
  imports: [PageHead],
  template: `<app-page-head [head]="head" />`,
})
export class About {
  private readonly lang = inject(I18nService).language();
  readonly head = inject(ABOUT_CONTENT).head[this.lang];
}
