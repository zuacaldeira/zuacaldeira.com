import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Language, Translations } from '../models/i18n';
import { en } from '../i18n/en';
import { pt } from '../i18n/pt';

const TRANSLATION_MAP: Record<Language, Translations> = {
  en,
  pt,
  de: en, // fallback until de.ts is created
  fr: en, // fallback until fr.ts is created
};

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly STORAGE_KEY = 'zc-lang';
  private readonly platformId = inject(PLATFORM_ID);

  readonly language = signal<Language>('en');
  readonly translations = computed<Translations>(() => TRANSLATION_MAP[this.language()]);

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    if (saved && saved in TRANSLATION_MAP) {
      this.language.set(saved);
      return;
    }

    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang in TRANSLATION_MAP) {
      this.language.set(browserLang);
    }
  }

  setLanguage(lang: Language): void {
    this.language.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }
}
