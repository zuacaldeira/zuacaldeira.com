import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly navItems = computed(() =>
    this.contentService.navItems.map((item) => ({
      ...item,
      label: this.t().nav[item.page],
    }))
  );
  readonly socialLinks = this.contentService.socialLinks;
  readonly currentYear = new Date().getFullYear();
}
