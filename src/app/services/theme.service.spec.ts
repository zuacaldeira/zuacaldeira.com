import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

function createService(platformId: string = 'browser'): ThemeService {
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: platformId }],
  });
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  describe('default state', () => {
    it('should default to light mode', () => {
      const service = createService();
      expect(service.isDarkMode()).toBe(false);
    });

    it('should not add dark-theme class by default', () => {
      createService();
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });
  });

  describe('toggleTheme()', () => {
    it('should switch to dark mode when in light mode', () => {
      const service = createService();
      service.toggleTheme();
      expect(service.isDarkMode()).toBe(true);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    it('should switch back to light mode when in dark mode', () => {
      const service = createService();
      service.toggleTheme();
      service.toggleTheme();
      expect(service.isDarkMode()).toBe(false);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const service = createService();
      service.toggleTheme();
      expect(service.isDarkMode()).toBe(true);
      service.toggleTheme();
      expect(service.isDarkMode()).toBe(false);
      service.toggleTheme();
      expect(service.isDarkMode()).toBe(true);
    });
  });

  describe('localStorage persistence', () => {
    it('should save "dark" to localStorage when enabling dark mode', () => {
      const service = createService();
      service.toggleTheme();
      expect(localStorage.getItem('zc-theme')).toBe('dark');
    });

    it('should save "light" to localStorage when enabling light mode', () => {
      const service = createService();
      service.toggleTheme();
      service.toggleTheme();
      expect(localStorage.getItem('zc-theme')).toBe('light');
    });
  });

  describe('localStorage restore', () => {
    it('should restore dark mode from localStorage on init', () => {
      localStorage.setItem('zc-theme', 'dark');
      const service = createService();
      expect(service.isDarkMode()).toBe(true);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    it('should restore light mode from localStorage on init', () => {
      localStorage.setItem('zc-theme', 'light');
      const service = createService();
      expect(service.isDarkMode()).toBe(false);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });
  });

  describe('system preference detection', () => {
    it('should enable dark mode when system prefers dark and no saved preference', () => {
      (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
        matches: true,
      } as MediaQueryList);

      const service = createService();
      expect(service.isDarkMode()).toBe(true);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    it('should stay light when system prefers light and no saved preference', () => {
      const service = createService();
      expect(service.isDarkMode()).toBe(false);
    });

    it('should prefer saved preference over system preference', () => {
      localStorage.setItem('zc-theme', 'light');
      (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
        matches: true,
      } as MediaQueryList);

      const service = createService();
      expect(service.isDarkMode()).toBe(false);
    });
  });

  describe('DOM manipulation', () => {
    it('should add dark-theme class to <html> element', () => {
      const service = createService();
      service.toggleTheme();
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    it('should remove dark-theme class from <html> element', () => {
      const service = createService();
      service.toggleTheme();
      service.toggleTheme();
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });
  });

  describe('SSR safety', () => {
    it('should default to light mode on server platform', () => {
      const service = createService('server');
      expect(service.isDarkMode()).toBe(false);
    });

    it('should not access localStorage on server platform', () => {
      localStorage.setItem('zc-theme', 'dark');
      const spy = vi.spyOn(Storage.prototype, 'getItem');

      createService('server');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should not modify DOM on toggleTheme() on server platform', () => {
      const service = createService('server');
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      service.toggleTheme();
      expect(service.isDarkMode()).toBe(false);
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
