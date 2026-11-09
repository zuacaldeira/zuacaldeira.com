import { Component, inject } from '@angular/core';
import { SOFTWARE_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';
import { WorkRow } from '../../../common/work-row/work-row';

/** "More work" on the Software page: one shared `WorkRow` per piece (software-spec.md, D26; D21 in research.md). */
@Component({
  selector: 'app-work-rows',
  imports: [WorkRow],
  templateUrl: './work-rows.html',
  styleUrl: './work-rows.css',
})
export class WorkRows {
  readonly work = inject(SOFTWARE_CONTENT).work[inject(I18nService).language()];
}
