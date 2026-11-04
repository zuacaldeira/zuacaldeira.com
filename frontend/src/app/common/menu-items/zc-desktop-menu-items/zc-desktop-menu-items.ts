import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { I18nService } from '../../../services/i18n.service';
import { pagePath } from '../../../models/i18n';

@Component({
  selector: 'app-zc-desktop-menu-items',
  imports: [RouterModule],
  templateUrl: './zc-desktop-menu-items.html',
  styleUrl: './zc-desktop-menu-items.css',
})
export class ZcDesktopMenuItems {
  private contentService = inject(ContentService);
  private i18n = inject(I18nService);
  readonly t = this.i18n.translations;
  // Contact is promoted to the toolbar's "Get in touch" button, so it is dropped
  // here to avoid listing Contact twice in the same bar.
  readonly navItems = computed(() =>
    this.contentService.navItems
      .filter((item) => item.page !== 'contact')
      .map((item) => ({
        ...item,
        label: this.t().nav[item.page],
        link: pagePath(this.i18n.language(), item.page),
      })),
  );
}
