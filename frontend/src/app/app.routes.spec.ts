import { provideTestContent } from './content/content.testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';
import { RenderMode } from '@angular/ssr';
import { I18nService } from './services/i18n.service';
import { SITE_PAGES } from './models/i18n';

@Component({ template: '' })
class DummyComponent {}

describe('App Routes', () => {
  describe('route definitions', () => {
    it.each(['en', 'de', 'pt'])('should give %s its own route tree', (lang) => {
      const tree = routes.find((r) => r.path === lang);
      const paths = tree?.children?.map((r) => r.path);
      expect(paths).toEqual(['home', 'about', 'software', 'research', 'writing', 'running', 'contact']);
    });

    it('SHELL-09: should have the pages the language links know, SITE_PAGES', () => {
      const tree = routes.find((r) => r.path === 'de');
      expect(tree?.children?.map((r) => r.path)).toEqual(SITE_PAGES);
    });

    it('should not expose the hidden work and paedagogik routes', () => {
      const paths = routes.flatMap((r) => (r.children ?? []).map((c) => c.path));
      expect(paths).not.toContain('work');
      expect(paths).not.toContain('paedagogik');
    });

    it('should lazy-load all page routes', () => {
      const pageRoutes = routes.flatMap((r) => r.children ?? []);
      for (const route of pageRoutes) {
        // A page with text from the content API loads a route file with it (D21).
        expect(route.loadComponent ?? route.loadChildren, `${route.path} should be lazy`).toBeDefined();
      }
    });
  });

  describe('lazy-loaded components', () => {
    it.each([
      ['home', 'Home'],
      ['about', 'About'],
      ['software', 'Software'],
      ['research', 'Research'],
      ['writing', 'Writing'],
      ['running', 'Running'],
      ['contact', 'Contact'],
    ])('%s should resolve to %s component', async (path, componentName) => {
      const route = routes.find((r) => r.path === 'en')?.children?.find((r) => r.path === path);
      const component = route?.loadComponent
        ? await (route.loadComponent as () => Promise<unknown>)()
        : (await (route!.loadChildren as () => Promise<Routes>)())[0].component;
      expect(component, componentName).toBeTruthy();
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
      TestBed.configureTestingModule({
        providers: [provideRouter(routes), provideTestContent()],
      });
    });

    it('HOME-PAGE-04: should show the English home at / without a redirect', async () => {
      TestBed.inject(I18nService).setLanguage('de');
      const harness = await RouterTestingHarness.create('/');
      expect(TestBed.inject(Location).path()).toBe('');
      expect(harness.routeNativeElement?.tagName).toBe('APP-HOME');
      expect(TestBed.inject(I18nService).language()).toBe('en');
      expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('en');
    });

    it('should navigate to /en/about', async () => {
      await RouterTestingHarness.create('/en/about');
      const location = TestBed.inject(Location);
      expect(location.path()).toBe('/en/about');
    });

    it.each([
      ['/404', 'APP-NOT-FOUND'],
      ['/fr/home', 'APP-NOT-FOUND'],
      ['/en/nope', 'APP-NOT-FOUND'],
      ['/de/home', 'APP-HOME'],
    ])('HOME-PAGE-06: should show %s as %s (D32)', async (url, tagName) => {
      const harness = await RouterTestingHarness.create(url);
      expect(harness.routeNativeElement?.tagName).toBe(tagName);
    });

    it('SW-PAGE-01: should show /de/software as the Software page, in German', async () => {
      TestBed.inject(I18nService).setLanguage('en');
      const harness = await RouterTestingHarness.create('/de/software');
      expect(harness.routeNativeElement?.tagName).toBe('APP-SOFTWARE');
      expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('de');
    });

    it('WR-PAGE-01: should show /de/writing as the Writing page, in German', async () => {
      TestBed.inject(I18nService).setLanguage('en');
      const harness = await RouterTestingHarness.create('/de/writing');
      expect(harness.routeNativeElement?.tagName).toBe('APP-WRITING');
      expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('de');
    });

    it.each(['de', 'pt'])('HOME-PAGE-01: should set the language from the /%s prefix', async (lang) => {
      TestBed.inject(I18nService).setLanguage('en');
      await RouterTestingHarness.create(`/${lang}/home`);
      expect(TestBed.inject(I18nService).language()).toBe(lang);
      expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe(lang);
    });
  });

  describe('page text (D21)', () => {
    // No content at the root: each page's route brings its own, `@page-content/<page>` (in the
    // specs the small test files of content/testing/).
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    });

    it.each([
      ['/de/software', 'h1', 'heading de'],
      ['/de/writing', 'h1', 'writing heading de'],
      ['/pt/home', 'h1', 'headline pt'],
      ['/', 'h1', 'headline en'],
    ])('SW-PAGE-14: %s brings its own text with its route', async (url, selector, text) => {
      const harness = await RouterTestingHarness.create(url);
      expect(harness.routeNativeElement?.querySelector(selector)?.textContent?.trim()).toBe(text);
    });
  });

  describe('page head', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
      TestBed.configureTestingModule({ providers: [provideRouter(routes), provideTestContent()] });
    });

    const alternates = () =>
      [...TestBed.inject(DOCUMENT).head.querySelectorAll('link[rel="alternate"]')].map(
        (l) => `${l.getAttribute('hreflang')} ${l.getAttribute('href')}`,
      );

    it('HOME-PAGE-02: should link /de/home to its versions in every language', async () => {
      await RouterTestingHarness.create('/de/home');
      expect(alternates()).toEqual([
        'en https://zuacaldeira.com/en/home',
        'de https://zuacaldeira.com/de/home',
        'pt https://zuacaldeira.com/pt/home',
        'x-default https://zuacaldeira.com/en/home',
      ]);
    });

    it('HOME-PAGE-04: should link the site root to the home in every language', async () => {
      await RouterTestingHarness.create('/');
      expect(alternates()).toEqual([
        'en https://zuacaldeira.com/en/home',
        'de https://zuacaldeira.com/de/home',
        'pt https://zuacaldeira.com/pt/home',
        'x-default https://zuacaldeira.com/en/home',
      ]);
    });

    it('should replace the alternates when the page changes', async () => {
      const harness = await RouterTestingHarness.create('/de/home');
      await harness.navigateByUrl('/pt/about');
      expect(alternates()[0]).toBe('en https://zuacaldeira.com/en/about');
      expect(alternates()).toHaveLength(4);
    });
  });

  describe('server routes', () => {
    it('should have a catch-all prerender route', () => {
      expect(serverRoutes).toHaveLength(1);
      expect(serverRoutes[0].path).toBe('**');
      expect(serverRoutes[0].renderMode).toBe(RenderMode.Prerender);
    });
  });
});
