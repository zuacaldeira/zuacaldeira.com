import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ZcDesktopMenuItems } from '../../menu-items/zc-desktop-menu-items/zc-desktop-menu-items';
import { Footer } from '../../footer/footer';
import { ThemeToggle } from '../../theme-toggle/theme-toggle';
import { LanguageLinks } from '../../language-links/language-links';
import { I18nService } from '../../../services/i18n.service';
import { NavItem } from '../../../models/models';
import { pagePath } from '../../../models/i18n';

@Component({
  selector: 'app-zc-nav-desktop',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    ZcDesktopMenuItems,
    Footer,
    ThemeToggle,
    LanguageLinks,
  ],
  templateUrl: './zc-nav-desktop.html',
  styleUrl: './zc-nav-desktop.css',
})
export class ZcNavDesktop {
  private i18n = inject(I18nService);
  readonly t = this.i18n.translations;
  readonly link = (page: NavItem['page']) => pagePath(this.i18n.language(), page);
}
