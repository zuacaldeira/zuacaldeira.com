import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ZcDesktopMenuItems } from '../../menu-items/zc-desktop-menu-items/zc-desktop-menu-items';
import { Footer } from '../../footer/footer';
import { ThemeToggle } from '../../theme-toggle/theme-toggle';

@Component({
  selector: 'app-zc-nav-desktop',
  imports: [
    MatToolbarModule,
    RouterOutlet,
    RouterLink,
    ZcDesktopMenuItems,
    Footer,
    ThemeToggle,
  ],
  templateUrl: './zc-nav-desktop.html',
  styleUrl: './zc-nav-desktop.css',
})
export class ZcNavDesktop {}
