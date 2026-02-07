import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-praesentationen-list',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './praesentationen-list.html',
  styleUrl: './praesentationen-list.css',
})
export class PraesentationenList {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly praesentationen = this.contentService.praesentationen;
}
