import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ZcSidenavMenuItems } from '../../menu-items/zc-sidenav-menu-items/zc-sidenav-menu-items';
import { Footer } from '../../footer/footer';
import { ThemeToggle } from '../../theme-toggle/theme-toggle';
import { I18nService } from '../../../services/i18n.service';

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
  ],
  templateUrl: './zc-nav-mobile.html',
  styleUrl: './zc-nav-mobile.css',
})
export class ZcNavMobile {
  readonly t = inject(I18nService).translations;
  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.drawer) {
          this.drawer.close();
        }
      });
  }

  toggle(drawer: MatSidenav): void {
    drawer.toggle();
  }
}
