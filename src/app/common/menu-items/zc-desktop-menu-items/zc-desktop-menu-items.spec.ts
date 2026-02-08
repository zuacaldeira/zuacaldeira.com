import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ZcDesktopMenuItems } from './zc-desktop-menu-items';
import { I18nService } from '../../../services/i18n.service';

describe('ZcDesktopMenuItems', () => {
  let component: ZcDesktopMenuItems;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
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

  it('should have 7 translated nav items', () => {
    const items = component.navItems();
    expect(items).toHaveLength(7);
  });

  it('should translate labels based on current language', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('de');
    const items = component.navItems();
    expect(items[0].label).toBe('Startseite');
  });
});
