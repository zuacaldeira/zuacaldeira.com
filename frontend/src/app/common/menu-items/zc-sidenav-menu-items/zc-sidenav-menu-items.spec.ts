import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ZcSidenavMenuItems } from './zc-sidenav-menu-items';
import { I18nService } from '../../../services/i18n.service';

describe('ZcSidenavMenuItems', () => {
  let component: ZcSidenavMenuItems;
  let fixture: ComponentFixture<ZcSidenavMenuItems>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcSidenavMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcSidenavMenuItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 translated nav items', () => {
    const items = component.navItems();
    expect(items).toHaveLength(5);
  });

  it('SHELL-04: links to the pages in Portuguese on a Portuguese page, /pt/about', async () => {
    TestBed.inject(I18nService).setLanguage('pt');
    await fixture.whenStable();
    const hrefs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      '/pt/software',
      '/pt/research',
      '/pt/writing',
      '/pt/about',
      '/pt/contact',
    ]);
  });

  it('WR-PAGE-06, SHELL-05b (D16): on a German page reads Software, Forschung, Texte, Über mich, "⊥ Kontakt"', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const titles = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('[matListItemTitle]'),
    ].map((title) => title.textContent?.replace(/\s+/g, ' ').trim());
    expect(titles).toEqual(['Software', 'Forschung', 'Texte', 'Über mich', '⊥ Kontakt']);
  });

  it("SHELL-05b: hides Contact's ⊥ from screen readers, the only hidden text in the list", async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const hidden = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll(
        '[matListItemTitle] [aria-hidden="true"]',
      ),
    ].map((el) => [el.closest('a')?.getAttribute('href'), el.textContent?.trim()]);
    expect(hidden).toEqual([['/de/contact', '⊥']]);
  });

  it('should translate labels based on current language', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    const items = component.navItems();
    expect(items[2].label).toBe('Textos');
  });
});

@Component({ template: '' })
class AnyPage {}

describe('ZcSidenavMenuItems on a page of the site', () => {
  it('SW-PAGE-07 (D34): marks Software as the page you are on in the phone menu, and only it', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          ['home', 'about', 'software', 'research', 'running', 'contact'].map((page) => ({
            path: `pt/${page}`,
            component: AnyPage,
          })),
        ),
      ],
    }).overrideComponent(ZcSidenavMenuItems, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('pt');
    const fixture = TestBed.createComponent(ZcSidenavMenuItems);
    await TestBed.inject(Router).navigateByUrl('/pt/software');
    await fixture.whenStable();

    const current = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a[aria-current="page"]')];
    expect(current.map((a) => a.getAttribute('href'))).toEqual(['/pt/software']);
  });
});
