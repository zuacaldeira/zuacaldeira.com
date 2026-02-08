import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';
import { I18nService } from '../../services/i18n.service';

describe('Footer', () => {
  let component: Footer;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(Footer, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have translated nav items', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('en');
    const items = component.navItems();
    expect(items).toHaveLength(7);
    expect(items[0].label).toBe('Home');
    expect(items[0].route).toBe('/home');
  });

  it('should update nav labels when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    const items = component.navItems();
    expect(items[0].label).toBe('Início');
  });

  it('should expose social links', () => {
    expect(component.socialLinks.length).toBeGreaterThan(0);
  });

  it('should have the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
