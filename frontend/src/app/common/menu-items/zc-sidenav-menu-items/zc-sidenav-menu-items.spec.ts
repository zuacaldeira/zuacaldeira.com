import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
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
    expect(hrefs).toEqual(['/pt/home', '/pt/about', '/pt/research', '/pt/running', '/pt/contact']);
  });

  it('SHELL-05b: on a German page only Contact carries the ⊥, "⊥ Kontakt"', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const titles = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('[matListItemTitle]'),
    ].map((title) => title.textContent?.replace(/\s+/g, ' ').trim());
    expect(titles).toEqual(['Startseite', 'Über mich', 'Forschung', 'Laufen', '⊥ Kontakt']);
  });

  it('should translate labels based on current language', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    const items = component.navItems();
    expect(items[0].label).toBe('Início');
  });
});
