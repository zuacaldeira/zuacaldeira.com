import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT, SHARED_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * How the paper was checked (research-spec.md, "Components"; RS-CHECK-nn): the paper's four figures
 * from `research/checked`, then the evidence sentence the bands use (`shared/paper`), and nothing
 * after it (RS-CHECK-05: the rung note left with the wall, D26).
 */
@Component({
  selector: 'app-paper-checks',
  templateUrl: './paper-checks.html',
  styleUrl: './paper-checks.css',
})
export class PaperChecks {
  private readonly lang = inject(I18nService).language();
  readonly checked = inject(RESEARCH_CONTENT).checked[this.lang];
  readonly evidence = inject(SHARED_CONTENT).paper[this.lang].evidence;
}
