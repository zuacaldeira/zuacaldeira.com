import { Component, inject } from '@angular/core';
import { codeSpans } from '../../../content/code-spans';
import { CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/** The lead case study of the Software page: the TDD monitor (software-spec.md, `WorkLead`). */
@Component({
  selector: 'app-work-lead',
  templateUrl: './work-lead.html',
  styleUrl: './work-lead.css',
})
export class WorkLead {
  readonly lead = inject(CONTENT).software.lead[inject(I18nService).language()];
  readonly protocol = codeSpans(this.lead.protocol);
  readonly live = codeSpans(this.lead.live);
}
