import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';
import { pagePath } from '../../models/i18n';
import { LanguageLinks } from '../language-links/language-links';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, LanguageLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private contentService = inject(ContentService);
  private i18n = inject(I18nService);
  readonly t = this.i18n.translations;
  readonly navItems = computed(() =>
    this.contentService.navItems.map((item) => ({
      ...item,
      label: this.t().nav[item.page],
      link: pagePath(this.i18n.language(), item.page),
    }))
  );
  readonly socialLinks = this.contentService.socialLinks;
  readonly currentYear = new Date().getFullYear();
}
