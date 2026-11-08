import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';

/** The Software page (docs/examples/software.md; build spec docs/mockups/software/software-spec.md). */
@Component({
  selector: 'app-software',
  template: ``,
})
export class Software {
  constructor() {
    const head = inject(CONTENT).software.head[inject(I18nService).language()];
    // The name is not translated, so it stays here, not in the content (D9, D11).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${head.heading}`);
  }
}
