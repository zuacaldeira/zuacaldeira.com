import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
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
    expect(hrefs()).toEqual(['/de/home', '/de/about', '/de/research', '/de/running']);
  });

  it('SHELL-04: follows a change of language without a reload, /pt/about', async () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('de');
    await fixture.whenStable();
    i18n.setLanguage('pt');
    await fixture.whenStable();
    expect(hrefs()).toEqual(['/pt/home', '/pt/about', '/pt/research', '/pt/running']);
  });

  it('should translate labels based on current language', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('de');
    const items = component.navItems();
    expect(items[0].label).toBe('Startseite');
  });
});
