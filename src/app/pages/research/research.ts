import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeader } from '../../common/section-header/section-header';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-research',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, SectionHeader],
  templateUrl: './research.html',
  styleUrl: './research.css',
})
export class Research {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly publications = this.contentService.publications;
}
