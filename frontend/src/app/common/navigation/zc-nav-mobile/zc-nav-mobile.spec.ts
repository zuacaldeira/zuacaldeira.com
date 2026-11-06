import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ZcNavMobile } from './zc-nav-mobile';
import { I18nService } from '../../../services/i18n.service';

describe('ZcNavMobile', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  it('SHELL-04: links the logo to /de/home on a German page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const logo = (fixture.nativeElement as HTMLElement).querySelector('a.logo');
    expect(logo?.getAttribute('href')).toBe('/de/home');
  });

  it("SHELL-10: starts with the skip link to this page's main content, /pt/running#main-content", async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('pt');
    const fixture = TestBed.createComponent(ZcNavMobile);
    await TestBed.inject(Router).navigateByUrl('/pt/running');
    await fixture.whenStable();
    const first = (fixture.nativeElement as HTMLElement).firstElementChild;
    expect([first?.className, first?.getAttribute('href'), first?.textContent?.trim()]).toEqual([
      'skip-link',
      '/pt/running#main-content',
      'Saltar para o conteúdo principal',
    ]);
  });

  it('SHELL-01: shows EN, DE and PT in the phone bar', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const codes = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('header app-language-links a'),
    ].map((a) => a.textContent?.trim());
    expect(codes).toEqual(['EN', 'DE', 'PT']);
  });

  it('SHELL-06: orders the phone bar mark, EN DE PT, theme, menu', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const toolbar = (fixture.nativeElement as HTMLElement).querySelector('header mat-toolbar')!;
    const parts = [...toolbar.children]
      .filter((el) => !el.classList.contains('spacer'))
      .map((el) =>
        el.matches('a.logo')
          ? 'mark'
          : el.matches('button.menu-button')
            ? 'menu'
            : el.tagName.toLowerCase(),
      );
    expect(parts).toEqual(['mark', 'app-language-links', 'app-theme-toggle', 'menu']);
  });

  it('SHELL-06: keeps the name and the menu links out of the phone bar', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const header = (fixture.nativeElement as HTMLElement).querySelector('header')!;
    expect({
      name: header.textContent?.includes('Zua Caldeira'),
      menu: header.querySelector('app-zc-sidenav-menu-items') !== null,
    }).toEqual({ name: false, menu: false });
  });

  it('SHELL-08: slides the menu in from the right, the end of the bar', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    expect(fixture.componentInstance.drawer.position).toBe('end');
  });

  it('SHELL-08: names the menu dialog in the page language, Menü', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const drawer = (fixture.nativeElement as HTMLElement).querySelector('mat-sidenav');
    expect(drawer?.getAttribute('aria-label')).toBe('Menü');
  });

  it("SHELL-08: names the menu's navigation in the page language, Hauptnavigation", async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('mat-sidenav nav');
    expect(nav?.getAttribute('aria-label')).toBe('Hauptnavigation');
  });

  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavMobile);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have translations signal', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavMobile);
    fixture.detectChanges();
    expect(fixture.componentInstance.t()).toBeTruthy();
  });

  it('SHELL-08-P-04: the menu button opens the drawer, and a second click leaves it open', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'header button.menu-button',
    )!;
    button.click();
    button.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.drawer.opened).toBe(true);
  });
});
