import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { I18nService } from './i18n.service';
import { Language, LANGUAGES, Translations } from '../models/i18n';
import { en } from '../i18n/en';
import { pt } from '../i18n/pt';
import { de } from '../i18n/de';
import { fr } from '../i18n/fr';

const ALL_TRANSLATIONS: Record<Language, Translations> = { en, pt, de, fr };

function createService(platformId: string = 'browser'): I18nService {
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: platformId }],
  });
  return TestBed.inject(I18nService);
}

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('default state', () => {
    it('should default to English language', () => {
      const service = createService();
      expect(service.language()).toBe('en');
    });

    it('should return English translations by default', () => {
      const service = createService();
      expect(service.translations()).toBe(en);
    });
  });

  describe('setLanguage()', () => {
    it.each([
      ['pt', pt],
      ['de', de],
      ['fr', fr],
      ['en', en],
    ] as [Language, Translations][])(
      'should switch to %s and return correct translations',
      (lang, expectedTranslations) => {
        const service = createService();
        service.setLanguage(lang);
        expect(service.language()).toBe(lang);
        expect(service.translations()).toBe(expectedTranslations);
      }
    );
  });

  describe('translation completeness', () => {
    const sectionKeys = Object.keys(en) as (keyof Translations)[];

    it('should have the same top-level keys across all languages', () => {
      for (const lang of LANGUAGES) {
        const translation = ALL_TRANSLATIONS[lang];
        expect(Object.keys(translation).sort()).toEqual(sectionKeys.sort());
      }
    });

    it.each(LANGUAGES)('%s should have non-empty string values for all sections', (lang) => {
      const translation = ALL_TRANSLATIONS[lang];

      for (const section of sectionKeys) {
        const value = translation[section];
        if (Array.isArray(value)) {
          expect(value.length).toBeGreaterThan(0);
          for (const item of value) {
            for (const [key, val] of Object.entries(item)) {
              expect(val, `${lang}.${section}[].${key}`).toBeTruthy();
            }
          }
        } else {
          for (const [key, val] of Object.entries(value)) {
            expect(val, `${lang}.${section}.${key}`).toBeTruthy();
          }
        }
      }
    });

    it('should have the same number of roleCards, projects, and facharbeiten across languages', () => {
      for (const lang of LANGUAGES) {
        const t = ALL_TRANSLATIONS[lang];
        expect(t.roleCards.length, `${lang}.roleCards`).toBe(en.roleCards.length);
        expect(t.projects.length, `${lang}.projects`).toBe(en.projects.length);
        expect(t.facharbeiten.length, `${lang}.facharbeiten`).toBe(en.facharbeiten.length);
      }
    });
  });

  describe('localStorage persistence', () => {
    it('should save language to localStorage on setLanguage()', () => {
      const service = createService();
      service.setLanguage('pt');
      expect(localStorage.getItem('zc-lang')).toBe('pt');
    });

    it('should update localStorage when switching languages multiple times', () => {
      const service = createService();
      service.setLanguage('fr');
      expect(localStorage.getItem('zc-lang')).toBe('fr');
      service.setLanguage('de');
      expect(localStorage.getItem('zc-lang')).toBe('de');
    });
  });

  describe('localStorage restore', () => {
    it('should restore saved language from localStorage on init', () => {
      localStorage.setItem('zc-lang', 'pt');
      const service = createService();
      expect(service.language()).toBe('pt');
      expect(service.translations()).toBe(pt);
    });

    it('should ignore invalid saved language values', () => {
      localStorage.setItem('zc-lang', 'xx');
      const service = createService();
      expect(service.language()).toBe('en');
    });
  });

  describe('browser language detection', () => {
    it('should detect browser language when no saved preference', () => {
      const originalLanguage = navigator.language;
      Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true });

      const service = createService();
      expect(service.language()).toBe('pt');

      Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true });
    });

    it('should fall back to English for unsupported browser languages', () => {
      const originalLanguage = navigator.language;
      Object.defineProperty(navigator, 'language', { value: 'ja-JP', configurable: true });

      const service = createService();
      expect(service.language()).toBe('en');

      Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true });
    });

    it('should prefer saved language over browser language', () => {
      const originalLanguage = navigator.language;
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
      localStorage.setItem('zc-lang', 'de');

      const service = createService();
      expect(service.language()).toBe('de');

      Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true });
    });
  });

  describe('SSR safety', () => {
    it('should default to English on server platform', () => {
      const service = createService('server');
      expect(service.language()).toBe('en');
      expect(service.translations()).toBe(en);
    });

    it('should not access localStorage on server platform', () => {
      localStorage.setItem('zc-lang', 'pt');
      const spy = vi.spyOn(Storage.prototype, 'getItem');

      createService('server');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should not write to localStorage on setLanguage() on server platform', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      const service = createService('server');
      service.setLanguage('pt');

      expect(service.language()).toBe('pt');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
