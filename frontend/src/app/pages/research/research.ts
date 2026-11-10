import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RESEARCH_CONTENT } from '../../content/content';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';
import { PaperCard } from './paper-card/paper-card';
import { PaperResults } from './paper-results/paper-results';
import { PaperChecks } from './paper-checks/paper-checks';
import { ResearchTool } from './research-tool/research-tool';
import { ResearchMore } from './research-more/research-more';

/**
 * The Research page (docs/examples/research.md; build spec docs/mockups/research/research-spec.md).
 * Its head is the simple shared head, as on Software and Writing (D26).
 */
@Component({
  selector: 'app-research',
  imports: [PageHead, PaperCard, PaperResults, PaperChecks, ResearchTool, ResearchMore],
  template: `<app-page-head [head]="head" />
    <app-paper-card />
    <app-paper-results />
    <app-paper-checks />
    <app-research-tool />
    <app-research-more />`,
})
export class Research {
  private readonly lang = inject(I18nService).language();
  readonly head = inject(RESEARCH_CONTENT).head[this.lang];

  constructor() {
    // The name is not translated, so it stays here, not in the content (D11 in writing.md).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${this.head.heading}`);
  }
}
