import { Component, computed, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ZcSidenavMenuItems } from '../../menu-items/zc-sidenav-menu-items/zc-sidenav-menu-items';
import { Footer } from '../../footer/footer';
import { ThemeToggle } from '../../theme-toggle/theme-toggle';
import { LanguageLinks } from '../../language-links/language-links';
import { I18nService } from '../../../services/i18n.service';
import { NavItem } from '../../../models/models';
import { pagePath } from '../../../models/i18n';

@Component({
  selector: 'app-zc-nav-mobile',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    ZcSidenavMenuItems,
    Footer,
    ThemeToggle,
    LanguageLinks,
  ],
  templateUrl: './zc-nav-mobile.html',
  styleUrl: './zc-nav-mobile.css',
})
export class ZcNavMobile {
  private i18n = inject(I18nService);
  readonly t = this.i18n.translations;
  readonly link = (page: NavItem['page']) => pagePath(this.i18n.language(), page);
  @ViewChild('drawer') drawer!: MatSidenav;

  // The page's own path: a bare `#main-content` resolves against `<base href="/">` and leaves the page.
  private readonly url = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: inject(Router).url },
  );
  readonly skipHref = computed(() => `${this.url().split(/[?#]/)[0]}#main-content`);

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.drawer) {
        this.drawer.close();
      }
    });
  }
}
