import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeader } from '../../common/section-header/section-header';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-contact',
  imports: [MatButtonModule, MatIconModule, SectionHeader],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly socialLinks = this.contentService.socialLinks;
}
