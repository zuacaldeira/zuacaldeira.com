import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WRITING_CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';

/** The Writing page (docs/examples/writing.md; build spec docs/mockups/writing/writing-spec.md). */
@Component({
  selector: 'app-writing',
  imports: [PageHead],
  template: '<app-page-head [head]="head" />',
})
export class Writing {
  private readonly lang = inject(I18nService).language();
  readonly head = inject(WRITING_CONTENT).head[this.lang];

  constructor() {
    // The name is not translated, so it stays here, not in the content (D11).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${this.head.heading}`);
  }
}
