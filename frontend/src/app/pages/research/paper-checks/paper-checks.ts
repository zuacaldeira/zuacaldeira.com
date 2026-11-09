import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT, SHARED_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * How the paper was checked (research-spec.md, "Components"; RS-CHECK-nn): the paper's four figures
 * from `research/checked`, the evidence sentence the bands use (`shared/paper`), then the rung note
 * that tells the paper's count from the wall's (RS-WALL-05).
 */
@Component({
  selector: 'app-paper-checks',
  templateUrl: './paper-checks.html',
})
export class PaperChecks {
  private readonly lang = inject(I18nService).language();
  readonly checked = inject(RESEARCH_CONTENT).checked[this.lang];
  readonly evidence = inject(SHARED_CONTENT).paper[this.lang].evidence;
}
