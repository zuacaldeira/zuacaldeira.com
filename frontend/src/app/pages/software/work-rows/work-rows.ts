import { Component, inject } from '@angular/core';
import { SOFTWARE_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/** "More work" on the Software page: one row per piece (software-spec.md, `WorkRow`, D26). */
@Component({
  selector: 'app-work-rows',
  templateUrl: './work-rows.html',
  styleUrl: './work-rows.css',
})
export class WorkRows {
  readonly work = inject(SOFTWARE_CONTENT).work[inject(I18nService).language()];
}
