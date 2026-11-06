import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterOutlet, RouterLink } from '@angular/router';
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

  // The page's own path: a bare `#main-content` resolves against `<base href="/">` and leaves the page.
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  readonly skipHref = computed(() => `${this.url().split(/[?#]/)[0]}#main-content`);
}
