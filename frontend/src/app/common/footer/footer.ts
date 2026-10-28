import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';
import { Translations } from '../../models/i18n';

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
      label: this.t().nav[item.route.substring(1) as keyof Translations['nav']],
    }))
  );
  readonly socialLinks = this.contentService.socialLinks;
  readonly currentYear = new Date().getFullYear();
}
