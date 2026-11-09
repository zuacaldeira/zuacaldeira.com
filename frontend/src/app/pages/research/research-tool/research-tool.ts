import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT, WorkRow as WorkRowText } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';
import { WorkRow } from '../../../common/work-row/work-row';

/**
 * The tool behind the paper (research-spec.md, "Components"; RS-TOOL-nn): reticulateP in the Software
 * page's row, shared, not copied (D21), with its one link to the Software page (D22). No figure until
 * the BICA screenshot exists (D10, RS-SHOT-01).
 */
@Component({
  selector: 'app-research-tool',
  imports: [WorkRow],
  template: `<section class="rs-tool">
    <div class="rs-tool__in">
      <h2 class="rs-tool__heading">{{ tool.heading }}</h2>
      <app-work-row [row]="row" />
    </div>
  </section>`,
  styleUrl: './research-tool.css',
})
export class ResearchTool {
  readonly tool = inject(RESEARCH_CONTENT).tool[inject(I18nService).language()];
  readonly row: WorkRowText = {
    id: 'reticulatep',
    kicker: this.tool.kicker,
    title: this.tool.title,
    text: this.tool.text,
    stack: this.tool.stack,
    links: [this.tool.link],
  };
}
