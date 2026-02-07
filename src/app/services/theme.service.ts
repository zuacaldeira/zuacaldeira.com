import { Injectable, Renderer2, RendererFactory2, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly STORAGE_KEY = 'zc-theme';
  private readonly platformId = inject(PLATFORM_ID);

  isDarkMode = signal<boolean>(false);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else if (savedTheme === 'light') {
      this.enableLightMode();
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.enableDarkMode();
      }
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const htmlElement = document.documentElement;
    this.renderer.addClass(htmlElement, 'dark-theme');
    this.isDarkMode.set(true);
    localStorage.setItem(this.STORAGE_KEY, 'dark');
  }

  private enableLightMode(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const htmlElement = document.documentElement;
    this.renderer.removeClass(htmlElement, 'dark-theme');
    this.isDarkMode.set(false);
    localStorage.setItem(this.STORAGE_KEY, 'light');
  }
}
