import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { I18nService } from '../../../services/i18n.service';
import { Translations } from '../../../models/i18n';

@Component({
  selector: 'app-zc-desktop-menu-items',
  imports: [RouterModule],
  templateUrl: './zc-desktop-menu-items.html',
  styleUrl: './zc-desktop-menu-items.css',
})
export class ZcDesktopMenuItems {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  // /contact is promoted to the toolbar's "Get in touch" button, so it is dropped
  // here to avoid listing Contact twice in the same bar.
  readonly navItems = computed(() =>
    this.contentService.navItems
      .filter((item) => item.route !== '/contact')
      .map((item) => ({
        ...item,
        label: this.t().nav[item.route.substring(1) as keyof Translations['nav']],
      })),
  );
}
