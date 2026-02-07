import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { I18nService } from '../../../services/i18n.service';
import { Translations } from '../../../models/i18n';

@Component({
  selector: 'app-zc-sidenav-menu-items',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './zc-sidenav-menu-items.html',
  styleUrl: './zc-sidenav-menu-items.css',
})
export class ZcSidenavMenuItems {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly navItems = computed(() =>
    this.contentService.navItems.map((item) => ({
      ...item,
      label: this.t().nav[item.route.substring(1) as keyof Translations['nav']],
    }))
  );
}
