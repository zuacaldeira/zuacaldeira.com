import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';
import { RenderMode } from '@angular/ssr';

@Component({ template: '' })
class DummyComponent {}

describe('App Routes', () => {
  describe('route definitions', () => {
    it('should have 8 routes defined', () => {
      expect(routes).toHaveLength(8);
    });

    it('should redirect empty path to home', () => {
      const root = routes.find((r) => r.path === '');
      expect(root).toBeTruthy();
      expect(root!.redirectTo).toBe('home');
      expect(root!.pathMatch).toBe('full');
    });

    it('should have all expected route paths', () => {
      const paths = routes.map((r) => r.path);
      expect(paths).toEqual([
        '',
        'home',
        'about',
        'research',
        'work',
        'paedagogik',
        'running',
        'contact',
      ]);
    });

    it('should lazy-load all page routes', () => {
      const pageRoutes = routes.filter((r) => r.path !== '');
      for (const route of pageRoutes) {
        expect(route.loadComponent, `${route.path} should use loadComponent`).toBeDefined();
      }
    });
  });

  describe('lazy-loaded components', () => {
    it.each([
      ['home', 'Home'],
      ['about', 'About'],
      ['research', 'Research'],
      ['work', 'Work'],
      ['paedagogik', 'Paedagogik'],
      ['running', 'Running'],
      ['contact', 'Contact'],
    ])('%s should resolve to %s component', async (path, componentName) => {
      const route = routes.find((r) => r.path === path);
      expect(route?.loadComponent).toBeDefined();
      const component = await (route!.loadComponent as () => Promise<unknown>)();
      expect(component).toBeTruthy();
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
      TestBed.configureTestingModule({
        providers: [provideRouter(routes)],
      });
    });

    it('should redirect / to /home', async () => {
      await RouterTestingHarness.create('/');
      const location = TestBed.inject(Location);
      expect(location.path()).toBe('/home');
    });

    it('should navigate to /about', async () => {
      await RouterTestingHarness.create('/about');
      const location = TestBed.inject(Location);
      expect(location.path()).toBe('/about');
    });

    it('should navigate to /contact', async () => {
      await RouterTestingHarness.create('/contact');
      const location = TestBed.inject(Location);
      expect(location.path()).toBe('/contact');
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
