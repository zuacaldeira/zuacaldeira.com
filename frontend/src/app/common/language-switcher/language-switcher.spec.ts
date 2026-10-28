import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LanguageSwitcher } from './language-switcher';
import { I18nService } from '../../services/i18n.service';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(LanguageSwitcher, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 languages', () => {
    expect(component.languages).toHaveLength(4);
  });

  it('should include all supported language codes', () => {
    const codes = component.languages.map((l) => l.code);
    expect(codes).toEqual(['en', 'pt', 'de', 'fr']);
  });

  it('should have non-empty labels for all languages', () => {
    for (const lang of component.languages) {
      expect(lang.label).toBeTruthy();
    }
  });

  it('should delegate setLanguage to I18nService', () => {
    const i18nService = TestBed.inject(I18nService);
    const spy = vi.spyOn(i18nService, 'setLanguage');

    component.setLanguage('pt');
    expect(spy).toHaveBeenCalledWith('pt');
  });
});
