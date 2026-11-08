import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ZcDesktopMenuItems } from './zc-desktop-menu-items';
import { I18nService } from '../../../services/i18n.service';

describe('ZcDesktopMenuItems', () => {
  let component: ZcDesktopMenuItems;
  let fixture: ComponentFixture<ZcDesktopMenuItems>;

  const hrefs = () =>
    [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcDesktopMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcDesktopMenuItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 translated nav items (contact is the toolbar button, not a text link)', () => {
    const items = component.navItems();
    expect(items).toHaveLength(5);
    expect(items.map((i) => i.page)).not.toContain('contact');
  });

  it('SHELL-04: links to the pages in German on a German page, without contact', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    expect(hrefs()).toEqual(['/de/home', '/de/about', '/de/software', '/de/research', '/de/running']);
  });

  it('SHELL-04: follows a change of language without a reload, /pt/about', async () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('de');
    await fixture.whenStable();
    i18n.setLanguage('pt');
    await fixture.whenStable();
    expect(hrefs()).toEqual(['/pt/home', '/pt/about', '/pt/software', '/pt/research', '/pt/running']);
  });

  it('SW-PAGE-10 (D13): lists Software before Research, the rest as before', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map(
      (a) => `${a.textContent?.trim()} → ${a.getAttribute('href')}`,
    );
    expect(links).toEqual([
      'Startseite → /de/home',
      'Über mich → /de/about',
      'Software → /de/software',
      'Forschung → /de/research',
      'Laufen → /de/running',
    ]);
  });

  it('SHELL-08: names the navigation in the page language, Navegação principal', async () => {
    TestBed.inject(I18nService).setLanguage('pt');
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('[role="navigation"]');
    expect(nav?.getAttribute('aria-label')).toBe('Navegação principal');
  });

  it('should translate labels based on current language', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('de');
    const items = component.navItems();
    expect(items[0].label).toBe('Startseite');
  });
});

@Component({ template: '' })
class AnyPage {}

describe('ZcDesktopMenuItems on a page of the site', () => {
  it('SHELL-04: marks About as current on /de/about, and not Home', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          ['home', 'about', 'research', 'running'].map((page) => ({
            path: `de/${page}`,
            component: AnyPage,
          })),
        ),
      ],
    }).overrideComponent(ZcDesktopMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcDesktopMenuItems);
    await TestBed.inject(Router).navigateByUrl('/de/about');
    await fixture.whenStable();

    const current = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a.active-link')];
    expect(current.map((a) => a.getAttribute('href'))).toEqual(['/de/about']);
  });
});
