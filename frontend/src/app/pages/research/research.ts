import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RESEARCH_CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';
import { ResearchWall } from './research-wall/research-wall';
import { PaperCard } from './paper-card/paper-card';
import { PaperResults } from './paper-results/paper-results';

/** The Research page (docs/examples/research.md; build spec docs/mockups/research/research-spec.md). */
@Component({
  selector: 'app-research',
  imports: [PageHead, ResearchWall, PaperCard, PaperResults],
  template: `<app-page-head [head]="head" class="page-head--wall">
      <app-research-wall />
    </app-page-head>
    <app-paper-card />
    <app-paper-results />`,
  styleUrl: './research.css',
})
export class Research {
  private readonly lang = inject(I18nService).language();
  readonly head = inject(RESEARCH_CONTENT).head[this.lang];

  constructor() {
    // The name is not translated, so it stays here, not in the content (D11 in writing.md).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${this.head.heading}`);
  }
}
