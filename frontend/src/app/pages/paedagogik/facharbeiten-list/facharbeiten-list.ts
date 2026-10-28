import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-facharbeiten-list',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './facharbeiten-list.html',
  styleUrl: './facharbeiten-list.css',
})
export class FacharbeitenList {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly facharbeiten = computed(() =>
    this.contentService.facharbeiten.map((item, i) => ({
      ...item,
      description: this.t().facharbeiten[i]?.description ?? item.description,
    }))
  );
}
