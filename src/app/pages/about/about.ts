import { Component, inject } from '@angular/core';
import { SectionHeader } from '../../common/section-header/section-header';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-about',
  imports: [SectionHeader],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly t = inject(I18nService).translations;
}
