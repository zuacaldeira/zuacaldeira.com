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

  it('should have 4 translated nav items (contact is the toolbar button, not a text link)', () => {
    const items = component.navItems();
    expect(items).toHaveLength(4);
    expect(items.map((i) => i.page)).not.toContain('contact');
  });

  it('SHELL-04: links to the pages in German on a German page, without contact', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    expect(hrefs()).toEqual(['/de/software', '/de/research', '/de/writing', '/de/about']);
  });

  it('SHELL-04: follows a change of language without a reload, /pt/about', async () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('de');
    await fixture.whenStable();
    i18n.setLanguage('pt');
    await fixture.whenStable();
    expect(hrefs()).toEqual(['/pt/software', '/pt/research', '/pt/writing', '/pt/about']);
  });

  it('WR-PAGE-06 (SHELL-11): reads Software, Forschung, Texte, Über mich on a German page', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map(
      (a) => `${a.textContent?.trim()} → ${a.getAttribute('href')}`,
    );
    expect(links).toEqual([
      'Software → /de/software',
      'Forschung → /de/research',
      'Texte → /de/writing',
      'Über mich → /de/about',
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
    expect(items[2].label).toBe('Texte');
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

  it('SW-PAGE-07 (D34): tells screen readers that Software is the page you are on, and only it', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          ['home', 'about', 'software', 'research', 'running'].map((page) => ({
            path: `de/${page}`,
            component: AnyPage,
          })),
        ),
      ],
    }).overrideComponent(ZcDesktopMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcDesktopMenuItems);
    await TestBed.inject(Router).navigateByUrl('/de/software');
    await fixture.whenStable();

    const current = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a[aria-current="page"]')];
    expect(current.map((a) => a.getAttribute('href'))).toEqual(['/de/software']);
  });

  it('WR-PAGE-07: marks Texte as the page you are on, on /de/writing, and only it', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          ['software', 'research', 'writing', 'about'].map((page) => ({
            path: `de/${page}`,
            component: AnyPage,
          })),
        ),
      ],
    }).overrideComponent(ZcDesktopMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcDesktopMenuItems);
    await TestBed.inject(Router).navigateByUrl('/de/writing');
    await fixture.whenStable();

    const current = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a[aria-current="page"]')];
    expect(current.map((a) => `${a.textContent?.trim()} → ${a.getAttribute('href')}`)).toEqual([
      'Texte → /de/writing',
    ]);
  });
});
