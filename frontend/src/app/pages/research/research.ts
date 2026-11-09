import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RESEARCH_CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';

/** The Research page (docs/examples/research.md; build spec docs/mockups/research/research-spec.md). */
@Component({
  selector: 'app-research',
  imports: [PageHead],
  template: '<app-page-head [head]="head" />',
})
export class Research {
  private readonly lang = inject(I18nService).language();
  readonly head = inject(RESEARCH_CONTENT).head[this.lang];

  constructor() {
    // The name is not translated, so it stays here, not in the content (D11 in writing.md).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${this.head.heading}`);
  }
}
