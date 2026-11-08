import { Component, inject } from '@angular/core';
import { SessionType } from '../../../common/session-type/session-type';
import { codeSpans } from '../../../content/code-spans';
import { SOFTWARE_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * The Run line of the lab's checked workflow type, word for word (docs/notation/run.st, D5, D17),
 * broken at its commas with whitespace only. Notation: never translated, never content (D19).
 */
const RUN_LINE =
  'Run = &{runTest: +{RED: Code,\n' +
  '                   WRONG_RED: Fix,\n' +
  '                   GREEN: Green}}';

/** The lead case study of the Software page: the TDD monitor (software-spec.md, `WorkLead`). */
@Component({
  selector: 'app-work-lead',
  imports: [SessionType],
  templateUrl: './work-lead.html',
  styleUrl: './work-lead.css',
})
export class WorkLead {
  readonly lead = inject(SOFTWARE_CONTENT).lead[inject(I18nService).language()];
  readonly protocol = codeSpans(this.lead.protocol);
  readonly live = codeSpans(this.lead.live);
  readonly run = RUN_LINE;
}
