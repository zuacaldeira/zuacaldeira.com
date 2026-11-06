import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ZcSidenavMenuItems } from '../../menu-items/zc-sidenav-menu-items/zc-sidenav-menu-items';
import { Footer } from '../../footer/footer';
import { ThemeToggle } from '../../theme-toggle/theme-toggle';
import { LanguageLinks } from '../../language-links/language-links';
import { I18nService } from '../../../services/i18n.service';
import { NavItem } from '../../../models/models';
import { injectPageUrl, pagePath } from '../../../models/i18n';

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
  @ViewChild('main') main!: ElementRef<HTMLElement>;

  // The page's own path: a bare `#main-content` resolves against `<base href="/">` and leaves the page.
  private readonly url = injectPageUrl();
  readonly skipHref = computed(() => `${this.url().split(/[?#]/)[0]}#main-content`);

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.drawer?.opened) {
        // After a link in the menu the new page's content, not the menu button, gets focus (D9);
        // once closed, so Material's own return of focus comes first.
        this.drawer.close().then(() => this.main.nativeElement.focus());
      }
    });
  }
}
